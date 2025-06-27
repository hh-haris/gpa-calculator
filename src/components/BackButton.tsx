
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      onClick={() => navigate('/')}
      variant="ghost"
      className="mb-4 text-[#0088CC] hover:bg-[#EEEEEE]"
    >
      <ArrowLeft size={16} className="mr-2" />
      Back to Home
    </Button>
  );
};

export default BackButton;
