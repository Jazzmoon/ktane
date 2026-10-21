import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [n, setN] = useState(0)
  return <button onClick={() => setN(n + 1)}>Simple Wires {n}</button>
}
