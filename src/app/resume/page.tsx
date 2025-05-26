import ResumeUI from '@/component/unit/resume/ResumeUI'

export const generateMetadata = () => {
  return {
    title: '경력',
    customMeta: {
      pageTitle: 'Resume',
    },
  };
};

export default function Resume() {
  return (
    <ResumeUI/>
  )
}
