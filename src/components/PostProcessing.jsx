import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { KernelSize } from 'postprocessing'

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

const PostProcessing = () => (
  <EffectComposer multisampling={0}>
    <Bloom
      intensity={isMobile ? 1.2 : 1.8}
      luminanceThreshold={0.4}
      luminanceSmoothing={0.82}
      mipmapBlur
      kernelSize={isMobile ? KernelSize.VERY_SMALL : KernelSize.SMALL}
    />
  </EffectComposer>
)

export default PostProcessing
