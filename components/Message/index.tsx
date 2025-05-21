const Message: React.FC<{ variant?: string; children?: React.ReactNode }> = ({
  variant = 'info',
  children,
}) => {
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'success':
        return 'bg-green-100 text-green-700 border border-green-300';
      case 'danger':
        return 'bg-red-100 text-red-700 border border-red-300';
      case 'warning':
        return 'bg-yellow-100 text-yellow-700 border border-yellow-300';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-700 border border-blue-300';
    }
  };

  return (
    <div className={`px-4 py-3 rounded-lg text-sm font-medium text-center m-4 ${getVariantClasses(variant)}`}>
      {children}
    </div>
  );
};

export default Message;
