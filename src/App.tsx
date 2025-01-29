// @ts-nocheck
// Creating amazon dynamo db

import { useEffect, useState } from 'react';
import type { Schema } from '../amplify/data/resource';
import { generateClient } from '@aws-amplify/api';
import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema['Todo']['Item']>>([]);
  console.info('adding a log!!');
  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt('What would you like to do?') });
  }

  const fetchTodos = async () => {
    const { data: items, errors } = await client.models.Todo.list();
    alert(items.length + " todos fetched")
  };

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
      <Authenticator>
      {({signOut, _user})=> (
            <main>
              <h1>My todos</h1>git
              <button onClick={createTodo}>+ new</button>
              <ul>
                {todos.map((todo) => (
                  <li key={todo.id} onClick={() => deleteTodo(todo.id)}>{todo.content}</li>
                ))}
              </ul>
              <div>
                🥳 App successfully hosted. Try creating a new todo.
                <br />
                <a href="https://docs.amplify.aws/gen2/start/quickstart/">
                  Review next step of this tutorial.
                </a>
              </div>
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <button onClick={fetchTodos}>Fetch Data</button>
                <button onClick={signOut}>Sign out</button>
              </div>
            </main>
        )}
    </Authenticator>
  );
}

export default App;