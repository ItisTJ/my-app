import Link from 'next/link';

interface SignUpStepsProps {
  step1: boolean;
  step2: boolean;
  step3: boolean;
}

const SignUpSteps = ({ step1, step2, step3 }: SignUpStepsProps) => {
  const steps = [
    {  href: '/register', active: step1 },
    {  href: '/verify', active: step2 },
    {  href: '/login', active: step3 },
  ];

  return (
    <div className="flex justify-center items-center space-x-4">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          {step.active ? (
            <Link href={step.href}>
              <div className="secondary w-8 h-8 rounded-full text-white flex items-center justify-center font-semibold shadow cursor-pointer">
                {index + 1}
              </div>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
              {index + 1}
            </div>
          )}


          {/* Line connector except after last item */}
          {index !== steps.length -1 && (
            <div className={`w-8 h-1 ${steps[index + 1].active ? 'bg-gradient-to-r from-blue-700 to-teal-600' : 'bg-gray-300'} mx-2`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SignUpSteps;
