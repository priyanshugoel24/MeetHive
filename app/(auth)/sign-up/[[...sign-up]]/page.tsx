import { SignUp } from '@clerk/nextjs'
import React from 'react'

const SignUpPage = () => {
  return (
    <main className='flex w-full h-screen justify-center items-center'>
        <SignUp />
    </main>
  )
}

export default SignUpPage
