'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input } from '@repo/ui';
import { useApi } from './ApiContext.jsx';

/** Items CRUD against the API. */
export function ItemsPanel() {
  const api = useApi();
  const items = api.items;
  const queryClient = useQueryClient();
  const queryKey = ['items'];
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const { data, error, isPending } = useQuery({ queryKey, queryFn: items.list });
  const refresh = () => queryClient.invalidateQueries({ queryKey });

  const create = useMutation({
    mutationFn: items.create,
    onSuccess: () => {
      setName('');
      return refresh();
    },
  });
  const update = useMutation({
    mutationFn: ({ id, name }) => items.update(id, { name }),
    onSuccess: () => {
      setEditing(null);
      return refresh();
    },
  });
  const remove = useMutation({ mutationFn: items.remove, onSuccess: refresh });

  const failure = error || create.error || update.error || remove.error;

  return (
    <Card title="Items">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate({ name });
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="New item" />
        <Button type="submit" disabled={create.isPending}>
          Add
        </Button>
      </form>

      {failure && <p className="mt-3 text-danger">{failure.message}</p>}
      {isPending && <p className="mt-3 text-muted">Loading...</p>}

      <ul className="mt-3 space-y-2">
        {data?.map((item) => (
          <li key={item.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {editing?.id === item.id ? (
              <>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ id: item.id, name: e.target.value })}
                />
                <Button onClick={() => update.mutate(editing)}>Save</Button>
                <Button variant="secondary" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <span className="flex-1 break-words">{item.name}</span>
                <Button
                  variant="secondary"
                  onClick={() => setEditing({ id: item.id, name: item.name })}
                >
                  Edit
                </Button>
                <Button variant="danger" onClick={() => remove.mutate(item.id)}>
                  Delete
                </Button>
              </>
            )}
          </li>
        ))}
      </ul>
    </Card>
  );
}
