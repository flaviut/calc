import * as React from 'react'
import Post from '../../components/Post'
import { NextPage } from 'next'

const IndexPage: NextPage = () => {
  return (
    <Post title="Home | Next.js + TypeScript Example">
      <h1>Hello Next.js 👋</h1>
    </Post>
  )
}

export default IndexPage
