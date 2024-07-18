import RatingStar from './rating-star'
import Date from './date'
import Image from 'next/image'

export default function Comment({ comment }) {
  return (
    <article>
      <div className="flex items-center space-x-3 mb-2">
        <Image className="w-8 h-8 rounded-full" src={comment.user.image} width={64} height={64} alt={comment.user.name} />
        <div className="text-sm text-gray-900 dark:text-white">{comment.user.name}</div>
      </div>
      <div className="flex items-center mb-1">
        <RatingStar className="w-5" on={comment.stars >= 1} />
        <RatingStar className="w-5" on={comment.stars >= 2} />
        <RatingStar className="w-5" on={comment.stars >= 3} />
        <RatingStar className="w-5" on={comment.stars >= 4} />
        <RatingStar className="w-5" on={comment.stars >= 5} />
        <h3 className="ml-2 text-sm text-gray-500 dark:text-gray-400">
          <Date dateString={comment.dateString} />
        </h3>
      </div>
      <p className="mb-8 text-gray-900 dark:text-white whitespace-pre-line">{comment.comment}</p>
    </article>
  )
}
