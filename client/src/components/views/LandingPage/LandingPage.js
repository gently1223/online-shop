import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Icon, Row, Col, Card} from 'antd';
import ImageSlider from '../../utils/ImageSlider'
const { Meta } = Card;
function LandingPage() {

    const [Products, setProducts] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)

    useEffect(() => {

        const variables = {
            skip: Skip,
            limit: Limit,
        }

        getProducts(variables)
    }, [])

    const getProducts = (variables) => {
        axios.post('/api/product/getProducts', variables)
            .then(response => {
                if (response.data.success) {
                    setProducts(response.data.products)
                    console.log(response.data.products)
                } else {
                    alert('Failed to fectch product datas')
                }
            })
    }

    const  onLoadMore = () => {
        let skip = Skip + Limit;

        const variables = {
            skip: skip,
            limit: Limit,
        }
        console.log(variables)
        getProducts(variables)
    }

    const renderCards = Products.map((product, index) => {
        return <Col lg={6} md={8} xs={24}>
            <Card key={index}
                hoverable={true}
                cover={<ImageSlider images={product.images} />}
            >
                <Meta 
                    title={product.title}
                    description={`$${product.price}`}
                />
            </Card>
        </Col>
    })

    return (
        <div style={{ width: '75%', margin: '3rem auto'}}>
            <div style={{ textAlign: 'center' }}>
                <h2> Let's Travel Anywhere <Icon type="rocket" /></h2>
            </div>

                            
                {/* Filter */}

                {/* Search */}
                {Products.length === 0 ?
                    <div style={{ display: 'flex', height: '300px', justifyContent: 'center', alignItems: 'center' }}>
                        <h2>No post yet...</h2>
                    </div> :
                    <div>
                        <Row gutter={[16, 16]}>
                            {renderCards}
                        </Row>
                    </div>
                }
                <br /><br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <button onClick={onLoadMore}>Load More</button>
                </div>
        </div>
    )
}

export default LandingPage
