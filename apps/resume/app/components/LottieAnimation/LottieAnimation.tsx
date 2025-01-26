import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Lottie from 'react-lottie';

import arcadeAnimationData from '../../../public/assets/lottyIcons/DashboardIcon.json';
import dashboardAnimationData from '../../../public/assets/lottyIcons/DashboardIcon.json';
import defaultAnimationData from '../../../public/assets/lottyIcons/PersonalInfo.json';
import diagnosisAnimationData from '../../../public/assets/lottyIcons/SkillIcon.json';
import linkedAnimationData from '../../../public/assets/lottyIcons/Summary.json';
import logoutAnimationData from '../../../public/assets/lottyIcons/LogoutIcon.json';
import profileAnimationData from '../../../public/assets/lottyIcons/ProfileIcon.json';

import type { ILottieAnimationProps } from './types';

const LottieAnimation = ({ isStopped, srcIndex }: ILottieAnimationProps) => {
  const animations = [
    { data: defaultAnimationData, label: 'Default Animation' },
    { data: profileAnimationData, label: 'Notification Animation' },
    { data: dashboardAnimationData, label: 'Dashboard Animation' },
    { data: arcadeAnimationData, label: 'Arcade Animation' },
    { data: linkedAnimationData, label: 'Linked Animation' },
    { data: diagnosisAnimationData, label: 'Diagnosis Animation' },
    { data: logoutAnimationData, label: 'Logout Animation' },
  ];
  const [animationIndex, setAnimationIndex] = useState(0);

  useEffect(() => {
    setAnimationIndex(srcIndex);
  }, [srcIndex]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animations[animationIndex]!.data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
      transparent: true,  // Add this line
      clearCanvas: true,  // Ensures canvas is cleared

    },
  };
  return  (
    <div className='bg-gray-100  rounded-md'>

      <Lottie 
        isStopped={isStopped} 
        options={defaultOptions} 
        width={36} 
        height={36} 
        style={{ fill: 'transparent' }}

      />
    </div>

  )
};

export default LottieAnimation;
