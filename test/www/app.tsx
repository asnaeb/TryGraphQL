import React from 'react'
import {createRoot} from 'react-dom/client'
import {TryGraphQL} from '../../lib'

const element = document.getElementById('main')
const root = createRoot(element!)
root.render(<TryGraphQL/>)

