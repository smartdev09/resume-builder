import { useEffect, useState } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import Lottie from 'react-lottie';

import arcadeAnimationData from 'public/assets/lottyIcons/Education.json';
import dashboardAnimationData from 'public/assets/lottyIcons/DashboardIcon.json';
import defaultAnimationData from 'public/assets/lottyIcons/PersonalInfo.json';
import diagnosisAnimationData from 'public/assets/lottyIcons/SkillIcon.json';
import linkedAnimationData from 'public/assets/lottyIcons/Summary.json';
import logoutAnimationData from 'public/assets/lottyIcons/LogoutIcon.json';
import notificationAnimationData from 'public/assets/lottyIcons/WorkExperience.json';
// import profileAnimationData from '@/public/assets/lottyIcons/ProfileIcon.json';

import type { ILottieAnimationProps } from './types';

// import { useUserAvatar } from './useUserAvatar';

const LottieAnimation = ({ srcIndex }: ILottieAnimationProps) => {
  // let animationDataSource = profileAnimationData;
  const animations = [
    { data: defaultAnimationData, label: 'Default Animation' },
    { data: notificationAnimationData, label: 'Notification Animation' },
    { data: dashboardAnimationData, label: 'Dashboard Animation' },
    { data: arcadeAnimationData, label: 'Arcade Animation' },
    { data: linkedAnimationData, label: 'Linked Animation' },
    { data: diagnosisAnimationData, label: 'Diagnosis Animation' },
    { data: logoutAnimationData, label: 'Logout Animation' },
  ];
  const [animationIndex, setAnimationIndex] = useState(0);

  // const setAnimation = () => {
  //   setAnimationIndex(srcIndex);
  // };

  useEffect(() => {
    setAnimationIndex(srcIndex);
  }, [srcIndex]);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animations[animationIndex]!.data,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return <Lottie options={defaultOptions} width={48} height={48} />;
};

export default LottieAnimation;
