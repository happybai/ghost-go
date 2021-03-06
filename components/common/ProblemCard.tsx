import {LazyLoadImage} from 'react-lazy-load-image-component';
import Link from 'next/link';

const ProblemCard = ({problem}: {problem: any}) => {
  const {rank, whofirst, image_url} = problem.attributes;
  return (
    <Link href={`/problems/${problem.id}`}>
      <div
        key={problem.id}
        className="relative cursor-pointer"
        style={{paddingTop: '100%'}}
      >
        <>
          <LazyLoadImage
            className="absolute w-full top-0"
            height={20}
            alt={problem.id}
            effect="opacity"
            src={image_url}
          />
          <div className="absolute left-2 bottom-0 text-black">
            LEVEL: {rank}
          </div>
          {whofirst === 'Black First' ? (
            <div className="absolute right-2 bottom-0.5 rounded-full h-4 w-4 flex items-center justify-center bg-black"></div>
          ) : (
            <div className="absolute right-2 bottom-0.5 rounded-full h-4 w-4 flex items-center justify-center bg-white border border-black"></div>
          )}
        </>
      </div>
    </Link>
  );
};

export default ProblemCard;
