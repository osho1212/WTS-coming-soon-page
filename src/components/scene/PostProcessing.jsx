import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const PostProcessing = () => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={isMobile ? 0.8 : 1.5}
      luminanceThreshold={0.45}
      luminanceSmoothing={0.9}
      mipmapBlur={!isMobile} // Disable mipmapBlur on mobile for performance
      kernelSize={isMobile ? KernelSize.SMALL : KernelSize.MEDIUM}
    />
  </EffectComposer>
)

export default PostProcessing
