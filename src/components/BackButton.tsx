
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end mb-4">
      <Button
        onClick={() => navigate('/')}
        variant="ghost"
        className="text-[#0088CC] hover:bg-[#EEEEEE]"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Button>
    </div>
  );
};

export default BackButton;
