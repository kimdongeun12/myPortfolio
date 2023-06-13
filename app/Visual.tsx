

import ParticlesUI from '@/src/component/Particles';
import '/public/styles/visual.scss';

export default function Visual() {

    // const particlesInit = useCallback(async (engine: Engine) => {
    //     console.log(engine);

    //     // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
    //     // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    //     // starting from v2 you can add only the features you need reducing the bundle size
    //     await loadFull(engine);
    // }, []);

  return (
    <div className="visual-wrap">
      <ParticlesUI/>
      
      <div className="visual-top">
        <div><span>조회수</span><span>1230</span></div>
        <div><span>방명록</span><span>0</span></div>
      </div>
      <div className="visual-middle">
        <div className="img-wrap lg">내 이미지</div>
        <div className="name-wrap">
          <div className="name">여기에 내 이름 애니메이션</div>
          <div className="kodchasan">FrontEnd Developer</div>
        </div>
        <div className="nav kodchasan">
          <a>Profile</a>
          <a>Resume</a>
          <a>Portfolio</a>
        </div>
        <div className="link-wrap">
          <a>Git</a>
          <a>Blog</a>
          <a>Mail</a>
        </div>
      </div>
      <div className='copyright'>© 2023. rlo-orn<br/>All rights reserved.</div>
    </div>
  )
}
