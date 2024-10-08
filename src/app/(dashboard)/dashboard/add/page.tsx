import React from 'react'
import AddFriendButton from '@/components/AddFriendButton'
const AddFriend:React.FC = () => {
  return (
    <main className='pt-8'>
        <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
        <AddFriendButton />
    </main>
  )
}

export default AddFriend