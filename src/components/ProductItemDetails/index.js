// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

class ProductItemDetails extends Component {
  state = {productItem: {}, isLoading: true}

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    console.log(this.props)
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const formattedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        title: data.title,
        totalReviews: data.total_reviews,
        similarProducts: data.similar_products.map(eachData => ({
          availability: eachData.availability,
          brand: eachData.brand,
          description: eachData.description,
          id: eachData.id,
          imageUrl: eachData.image_url,
          price: eachData.price,
          rating: eachData.rating,
          title: eachData.title,
          totalReviews: eachData.total_reviews,
        })),
      }

      console.log(formattedData.similarProducts)

      this.setState({productItem: formattedData, isLoading: false})
    }
  }

  getSimilarProduct = () => {
    const {productItem} = this.state
    const {similarProducts} = productItem
    console.log(similarProducts)

    return similarProducts.map(eachProduct => {
      const {imageUrl, title, brand, price, rating} = eachProduct
      return (
        <li className="smlr-prdt-container">
          <img src={imageUrl} alt={title} className="smlr-prdt-image" />
          <p className="smlr-prdt-title">{title}</p>
          <p className="smlr-prdt-brand">by {brand}</p>
          <div className="smlr-prdt-price-rating-container">
            <p className="smlr-prdt-price">Rs {price}/-</p>
            <div className="smlr-prdt-rating-container">
              <p className="smlr-prdt-rating">{rating}</p>
              <img
                src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                alt="star"
                className="smlr-prdt-star"
              />
            </div>
          </div>
        </li>
      )
    })
  }

  render() {
    const {productItem, isLoading} = this.state
    console.log(productItem)
    const {
      imageUrl,
      title,
      price,
      rating,
      totalReviews,
      description,
      availability,
      brand,
    } = productItem
    return (
      <>
        <Header />
        <div className="item-details-main-container">
          <div className="item-image-details-container">
            <img src={imageUrl} alt={title} className="item-image" />
            <div className="item-details-container">
              <h1 className="item-title">{title}</h1>
              <p className="item-price">Rs {price}/-</p>
              <div className="item-rating-reviews-container">
                <div className="item-rating-container">
                  <p className="item-rating">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="item-star"
                  />
                </div>
                <p className="item-review">{totalReviews} Reviews</p>
              </div>
              <p className="item-description">{description}</p>
              <p className="item-availability-brand">
                Available:{' '}
                <span className="item-availability-brand-values">
                  {availability}
                </span>
              </p>
              <p className="item-availability-brand">
                Brand:
                <span className="item-availability-brand-values">{brand}</span>
              </p>
              <hr className="item-horizontal-line" />
              <div className="item-quantity-container">
                <p className="plus-minus-sign">-</p>
                <p className="item-quantity">1</p>
                <p className="plus-minus-sign">+</p>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
            <div>
              <h1 className="smlr-prdt-heading">Similar Products</h1>
              <ul className="smlr-prdt-list-container">
                {!isLoading && this.getSimilarProduct()}
              </ul>
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default ProductItemDetails
