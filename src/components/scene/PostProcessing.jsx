import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const PostProcessing = () => (
  <EffectComposer multisampling={isMobile ? 0 : 4}>
    <Bloom
      intensity={isMobile ? 0.6 : 1.1}
      luminanceThreshold={0.4}
      luminanceSmoothing={0.9}
      mipmapBlur={!isMobile}
      kernelSize={KernelSize.MEDIUM}
    />
  </EffectComposer>
)

export default PostProcessing
