// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const productApiStatusList = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class ProductItemDetails extends Component {
  state = {
    productItem: {},
    apiStatus: productApiStatusList.initial,
    productQuantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: productApiStatusList.loading})
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

      return this.setState({
        productItem: formattedData,
        apiStatus: productApiStatusList.success,
      })
    }
    return this.setState({apiStatus: productApiStatusList.failure})
  }

  onClickingMinus = () => {
    const {productQuantity} = this.state
    if (productQuantity > 1) {
      this.setState(prevState => ({
        productQuantity: prevState.productQuantity - 1,
      }))
    }
  }

  onClickingPlus = () => {
    this.setState(prevState => ({
      productQuantity: prevState.productQuantity + 1,
    }))
  }

  onClickingContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  getSimilarProduct = () => {
    const {productItem} = this.state
    const {similarProducts} = productItem

    return similarProducts.map(eachProduct => {
      const {imageUrl, title, brand, price, rating} = eachProduct
      return (
        <li className="smlr-prdt-container" key={eachProduct.id}>
          <img
            src={imageUrl}
            alt="similar product"
            className="smlr-prdt-image"
          />
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

  renderProductItem = () => {
    const {productItem, productQuantity} = this.state
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
        <div className="item-details-main-container">
          <div className="item-image-details-container">
            <img src={imageUrl} alt="product" className="item-image" />
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
                <span className="item-availability-brand-values">
                  Available:{' '}
                </span>
                {availability}
              </p>
              <p className="item-availability-brand">
                <span className="item-availability-brand-values">Brand: </span>
                {brand}
              </p>
              <hr className="item-horizontal-line" />
              <div className="item-quantity-container">
                <button
                  type="button"
                  className="plus-minus-button"
                  testid="minus"
                >
                  <BsDashSquare
                    className="plus-square"
                    onClick={this.onClickingMinus}
                  />
                </button>
                <p className="item-quantity">{productQuantity}</p>
                <button
                  type="button"
                  className="plus-minus-button"
                  testid="plus"
                >
                  <BsPlusSquare
                    className="plus-square"
                    onClick={this.onClickingPlus}
                  />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="smlr-prdt-main-container">
            <h1 className="smlr-prdt-heading">Similar Products</h1>
            <ul className="smlr-prdt-list-container">
              {this.getSimilarProduct()}
            </ul>
          </div>
        </div>
      </>
    )
  }

  renderFailureView = () => (
    <div className="item-error-main-container">
      <div className="item-error-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="item-error-image"
        />
        <h1 className="item-error-heading">Product Not Found</h1>
        <button
          className="item-error-button"
          type="button"
          onClick={this.onClickingContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  )

  renderLoadingView = () => (
    <div testid="loader" className="item-loading-spinner">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getDisplayPage = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case productApiStatusList.success:
        return this.renderProductItem()
      case productApiStatusList.failure:
        return this.renderFailureView()
      case productApiStatusList.loading:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.getDisplayPage()}
      </>
    )
  }
}

export default ProductItemDetails
