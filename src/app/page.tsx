import AboutUs from '@/components/root/AboutUs'
import Products from '@/components/root/Products'
import Reviews from '@/components/root/Reviews'

export default function page() {
  return (
    <div className="min-h-screen pt-14 lg:pt-20">
      <Products />
      <AboutUs />
      <Reviews />
    </div>
  )
}
