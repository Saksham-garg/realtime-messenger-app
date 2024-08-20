import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

type Props = {}

const loading = (props: Props) => {
  return (
    <div className='w-full flex flex-col gap-3'>
        <Skeleton width={500} height={60}/>
        <Skeleton width={150} height={20}/>
        <Skeleton width={400} height={50}/>
    </div>
  )
}
export default loading