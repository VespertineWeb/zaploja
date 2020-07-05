import React, { FC, useState, useCallback, useEffect } from 'react'
import { List, Dropdown, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import ProductImage from './common/ProductImage'
import QuantitySelector from './QuantitySelector'
import Real from './Real'

const { Text } = Typography

type Props = {
  items: TenantConfig['items']
  onOrder: (a: any) => void
}

const ProductList: FC<Props> = ({ items, onOrder }) => {
  const [quantities, setQuantities] = useState<Record<number, string>>({})
  const setForIndex = useCallback(
    (i) => (value: string) => setQuantities({ ...quantities, [i]: value }),
    [quantities]
  )

  useEffect(() => {
    const order = ((Object.keys(
      quantities
    ) as unknown) as number[]).map((i) => [
      items[i].name,
      parseInt(quantities[i], 10),
      items[i].price,
    ])

    onOrder(order)
  }, [items, onOrder, quantities])

  return (
    <div className="mt3">
      <h2 className="tc">Qual seu pedido?</h2>
      <List
        itemLayout="horizontal"
        dataSource={items ? items.filter(({ live }) => live) : []}
        renderItem={({ headline, imgSrc, name, items: subitems, price }, i) => (
          <List.Item>
            <List.Item.Meta
              className="items-center"
              // Depois, adicionar uma imagem padrão aqui
              avatar={
                imgSrc ? <ProductImage src={imgSrc} title={name} /> : null
              }
              title={name}
              description={<Description headline={headline} items={subitems} />}
            />
            <div className="flex flex-column items-center justify-center w-25 tc">
              <div className="tc pb1">
                <b>
                  <Real cents={price} />
                </b>
              </div>
              <QuantitySelector
                quantity={quantities[i] || '0'}
                onQuantity={setForIndex(i)}
              />
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

type ArrayElement<ArrayType extends readonly unknown[]> = ArrayType[number]

const Description: FC<Pick<
  ArrayElement<TenantConfig['items']>,
  'headline' | 'items'
>> = ({ headline, items }) => (
  <div className="flex flex-column">
    {headline && <Text code>{headline}</Text>}
    {items?.length && (
      <Dropdown overlay={<MenuForItems items={items} />}>
        <div
          className="ant-dropdown-link"
          role="button"
          tabIndex={0}
          onClick={(e) => e.preventDefault()}
          onKeyPress={(e) => e.preventDefault()}
        >
          Detalhes <PlusOutlined />
        </div>
      </Dropdown>
    )}
  </div>
)

const MenuForItems: FC<Pick<ArrayElement<TenantConfig['items']>, 'items'>> = ({
  items,
}) => (
  <List
    size="small"
    className="bg-white"
    bordered
    dataSource={items}
    renderItem={(item) => <List.Item>{item}</List.Item>}
  />
)

export default ProductList
