import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

const emptyForm = {
  title: '',
  description: '',
  categoryId: '',
}

async function requestJson(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.erro || payload?.message || 'Não foi possível completar a operação.')
  }

  return payload
}

function App() {
  const [tarefas, setTarefas] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  async function loadTarefas(options = {}) {
    const { showLoading = true } = options

    if (showLoading) {
      setTarefas((current) => current ?? [])
    }

    setError('')

    try {
      const response = await requestJson('/tarefas')
      setTarefas(Array.isArray(response.dados) ? response.dados : [])
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    let active = true

    async function carregarTarefasIniciais() {
      try {
        const response = await requestJson('/tarefas')

        if (active) {
          setTarefas(Array.isArray(response.dados) ? response.dados : [])
        }
      } catch (err) {
        if (active) {
          setError(err.message)
          setTarefas([])
        }
      }
    }

    carregarTarefasIniciais()

    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const lista = tarefas ?? []
    const total = lista.length
    const concluidas = lista.filter((tarefa) => tarefa.completed).length
    const abertas = total - concluidas

    return { total, concluidas, abertas }
  }, [tarefas])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setMessage('')

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      categoryId: form.categoryId.trim() ? Number(form.categoryId) : undefined,
    }

    try {
      if (editingId) {
        await requestJson(`/tarefas/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        })
        setMessage('Tarefa atualizada com sucesso.')
      } else {
        await requestJson('/tarefas', {
          method: 'POST',
          body: JSON.stringify(payload),
        })
        setMessage('Tarefa criada com sucesso.')
      }

      resetForm()
      await loadTarefas()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  function handleEdit(tarefa) {
    setEditingId(tarefa.id)
    setForm({
      title: tarefa.title ?? '',
      description: tarefa.description ?? '',
      categoryId: tarefa.categoryId ? String(tarefa.categoryId) : '',
    })
    setMessage('')
    setError('')
  }

  async function handleToggleCompleted(tarefa) {
    setError('')

    try {
      await requestJson(`/tarefas/${tarefa.id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed: !tarefa.completed }),
      })
      setMessage(tarefa.completed ? 'Tarefa reaberta.' : 'Tarefa concluída.')
      await loadTarefas()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm('Deseja excluir esta tarefa?')

    if (!confirmDelete) {
      return
    }

    setError('')

    try {
      await requestJson(`/tarefas/${id}`, {
        method: 'DELETE',
      })
      setMessage('Tarefa removida.')
      if (editingId === id) {
        resetForm()
      }
      await loadTarefas()
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="eyebrow">CRUD conectado ao Prisma</span>
          <h1>Gerencie suas tarefas e veja o banco em ação.</h1>
          <p>
            Crie, edite, conclua e remova tarefas diretamente do frontend.
            A interface conversa com a API em <strong>{API_URL}</strong>.
          </p>
          <div className="stats">
            <article>
              <strong>{stats.total}</strong>
              <span>tarefas</span>
            </article>
            <article>
              <strong>{stats.abertas}</strong>
              <span>abertas</span>
            </article>
            <article>
              <strong>{stats.concluidas}</strong>
              <span>concluídas</span>
            </article>
          </div>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-header">
            <div>
              <span className="form-kicker">{editingId ? 'Editar tarefa' : 'Nova tarefa'}</span>
              <h2>{editingId ? `Tarefa #${editingId}` : 'Cadastrar tarefa'}</h2>
            </div>

            {editingId ? (
              <button type="button" className="ghost-button" onClick={resetForm}>
                Cancelar
              </button>
            ) : null}
          </div>

          <label>
            Título
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex.: Revisar relacionamento no Prisma"
              required
            />
          </label>

          <label>
            Descrição
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Descreva o que precisa ser feito"
              rows="4"
            />
          </label>

          <label>
            Categoria ID
            <input
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              placeholder="Opcional"
              inputMode="numeric"
            />
          </label>

          <button type="submit" className="primary-button" disabled={saving}>
            {saving ? 'Salvando...' : editingId ? 'Atualizar tarefa' : 'Criar tarefa'}
          </button>

          {message ? <p className="feedback success">{message}</p> : null}
          {error ? <p className="feedback error">{error}</p> : null}
        </form>
      </section>

      <section className="list-panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Lista sincronizada</span>
            <h2>Tarefas salvas no banco</h2>
          </div>

          <button type="button" className="ghost-button" onClick={() => loadTarefas()}>
            Atualizar
          </button>
        </div>

        {tarefas === null ? (
          <div className="empty-state">Carregando tarefas...</div>
        ) : tarefas.length === 0 ? (
          <div className="empty-state">
            Nenhuma tarefa encontrada. Cadastre a primeira para começar.
          </div>
        ) : (
          <div className="task-grid">
            {tarefas.map((tarefa) => (
              <article key={tarefa.id} className={`task-card ${tarefa.completed ? 'done' : ''}`}>
                <div className="task-card-top">
                  <div>
                    <span className="task-id">#{tarefa.id}</span>
                    <h3>{tarefa.title}</h3>
                  </div>

                  <button
                    type="button"
                    className={`status-pill ${tarefa.completed ? 'is-done' : ''}`}
                    onClick={() => handleToggleCompleted(tarefa)}
                  >
                    {tarefa.completed ? 'Concluída' : 'Aberta'}
                  </button>
                </div>

                <p className="task-description">
                  {tarefa.description || 'Sem descrição cadastrada.'}
                </p>

                <div className="task-meta">
                  <span>Categoria {tarefa.categoryId ?? 'não definida'}</span>
                  <span>
                    Atualizada em{' '}
                    {tarefa.updatedAt ? new Date(tarefa.updatedAt).toLocaleString('pt-BR') : 'n/d'}
                  </span>
                </div>

                <div className="task-actions">
                  <button type="button" className="secondary-button" onClick={() => handleEdit(tarefa)}>
                    Editar
                  </button>
                  <button type="button" className="danger-button" onClick={() => handleDelete(tarefa.id)}>
                    Excluir
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default App
