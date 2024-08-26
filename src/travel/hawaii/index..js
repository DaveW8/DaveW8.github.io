import ImageGallery from "react-image-gallery";
import taiwan from "../../images/Taiwan.jpg";
import uk from "../../images/UK.jpg";
import hawaii from "../../images/Hawaii.jpg";
import singapore from "../../images/Singapore.jpg";

const images = [
  {
    original: taiwan,
    thumbnal: taiwan
  },
  {
    original: uk,
    thumbnal: uk
  },
  {
    original: hawaii,
    thumbnal: hawaii
  },
  {
    original: singapore,
    thumbnal: singapore
  }
]

export default function Hawaii() {
  return (
    <div>
      <div>
        Hawaii Banner
      </div>
      <ImageGallery items={images} />
    </div>
  )
}