import {
  assert,
  describe,
  expect,
  test,
} from 'vitest'

import { MockAgent } from 'undici'

import {
  ColormeApiClient,
} from '../src/index'

const BASE_URL = 'http://localhost'

describe('getShopScriptTagsV1', async () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'GET' }).reply(200, {
      script_tags: [
        {
          id: 1342332,
          account_id: 'PA12345678',
          oauth_application_id: 12,
          src: 'https://example.com/example.js',
          integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
          display_scope: 'shop',
          make_date: 1465784944,
          update_date: 1494496809,
        },
      ],
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopScriptTagsV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.script_tags !== undefined)
    expect(json.script_tags.length).toBe(1)
    expect(json.script_tags[0].id).toBe(1342332)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopScriptTagsV1()({})
    assert(response.ok === false)
  })
})

describe('createShopScriptTagV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'POST' }).reply(200, {
      script_tag: {
        id: 1342332,
        account_id: 'PA12345678',
        oauth_application_id: 12,
        src: 'https://example.com/example.js',
        integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
        display_scope: 'shop',
        make_date: 1465784944,
        update_date: 1494496809,
      },
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.createShopScriptTagV1()({
      params: {
        body: {
          script_tag: {
            src: 'https://example.com/example.js',
            integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
            display_scope: 'shop',
          },
        },

      },
    })
    assert(response.ok)

    const json = await response.json()
    assert(json.script_tag !== undefined)
    expect(json.script_tag.id).toBe(1342332)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags.json', method: 'POST' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.createShopScriptTagV1()({
      params: {
        body: {
          script_tag: {
            src: 'https://example.com/example.js',
            integrity: 'sha384-oqVuAfXRKap7fdgcCY5uykM6+R9GqQ8K/uxy9rx7HNQlGYl1kPzQho1wx4JwY8wC',
            display_scope: 'shop',
          },
        },
      },
    })
    assert(response.ok === false)
  })
})

describe('deleteScriptTagV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags/1342332.json', method: 'DELETE' }).reply(204)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.deleteScriptTagV1()({ params: { path: { scriptTagId: 1342332 } } })
    assert(response.ok)

    const json = await response.json()
    expect(json).toBe(undefined)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/appstore/v1/script_tags/1342332.json', method: 'DELETE' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.deleteScriptTagV1()({ params: { path: { scriptTagId: 1342332 } } })
    assert(response.ok === false)
  })
})

describe('getAccessToken', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/oauth/token', method: 'POST' }).reply(200, {
      access_token: 'd461ab8XXXXXXXXXXXXXXXXXXXXXXXXX',
      token_type: 'bearer',
      scope: 'read_products write_products',
    })

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getAccessToken()(
      {
        params: {
          body: {
            client_id: 'CLIENT_ID',
            client_secret: 'CLIENT_SECRET',
            code: 'CODE',
            grant_type: 'authorization_code',
            redirect_uri: 'REDIRECT_URI',
          },
        },
      },
    )
    assert(response.ok)

    const json = await response.json()
    expect(json.access_token).toBe('d461ab8XXXXXXXXXXXXXXXXXXXXXXXXX')

    client.setAccessToken({})

    client.setAccessToken({
      accessToken: json.access_token,
      tokenType: json.token_type,
      scope: json.scope,
    })
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/oauth/token', method: 'POST' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getAccessToken()(
      {
        params: {
          body: {
            client_id: 'CLIENT_ID',
            client_secret: 'CLIENT_SECRET',
            code: 'CODE',
            grant_type: 'authorization_code',
            redirect_uri: 'REDIRECT_URI',
          },
        },
      },
    )
    assert(response.ok === false)
  })
})

describe('getShopV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop', method: 'GET' }).reply(200,
      {
        shop: {
          id: 'PAXXXXXXXX',
          state: 'enabled',
          domain_plan: 'cmsp_sub_domain',
          contract_plan: 'unknown',
          contract_start_date: 1546268400,
          contract_end_date: 1577718000,
          contract_term: 12,
          last_login_date: 1570750709,
          setup_date: 1511747460,
          make_date: 1511747460,
          url: 'https://example.shop-pro.jp',
          open_state: 'opened',
          mobile_open_state: 'opened',
          login_id: 'testshop',
          name1: '山田',
          name2: '太郎',
          name1_kana: 'ヤマダ',
          name2_kana: 'タロウ',
          hojin: '',
          hojin_kana: '',
          user_mail: 'tarou@example.com',
          tel: '11-1111-1111',
          fax: null,
          postal: '1508512',
          pref_id: 13,
          pref_name: '東京都',
          address1: '渋谷区桜丘町',
          address2: '26-1 セルリアンタワー',
          title: 'テスト商店',
          title_short: 'テスト商店',
          shop_mail_1: 'shop@example.com',
          shop_mail_2: 'shop-phone@example.com',
          tax_type: 'excluded',
          tax: 10,
          tax_rounding_method: 'round_off',
          reduce_tax_rate: 8,
          shop_logo_url: 'https://img00.shop-pro.jp/PA00000/001/PA00000001.png?cmsp_timestamp=20201201214110',
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.shop !== undefined)
    expect(json.shop.id).toBe('PAXXXXXXXX')
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getShopV1()({})
    assert(response.ok === false)
  })
})

describe('getSalesV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/sales', method: 'GET' }).reply(200,
      {
        sales: [
          {
            id: 4434233,
            account_id: 'PAXXXXXXXX',
            make_date: 1465784934,
            update_date: 1494496895,
            payment_id: 751,
            mobile: false,
            paid: true,
            delivered: true,
            canceled: false,
            accepted_mail_state: 'not_yet',
            paid_mail_state: 'not_yet',
            delivered_mail_state: 'not_yet',
            accepted_mail_sent_date: 1363152822,
            paid_mail_sent_date: 1363153288,
            delivered_mail_sent_date: 1363154591,
            point_state: 'assumed',
            gmo_point_state: 'assumed',
            yahoo_point_state: 'assumed',
            product_total_price: 1000,
            delivery_total_charge: 350,
            fee: 300,
            tax: 80,
            noshi_total_charge: 0,
            card_total_charge: 200,
            wrapping_total_charge: 0,
            point_discount: 0,
            gmo_point_discount: 0,
            other_discount: 0,
            other_discount_name: '',
            total_price: 1930,
            granted_points: 100,
            use_points: 0,
            granted_gmo_points: 0,
            use_gmo_points: 0,
            granted_yahoo_points: 0,
            use_yahoo_points: 0,
            external_order_id: 'ABC0123456789',
            customer: {
              id: 998273,
              account_id: 'PA01234567',
              name: 'カラーミー太郎',
              furigana: 'カラーミータロウ',
              hojin: 'GMOペパボ株式会社',
              busho: 'EC事業部',
              sex: 'male',
              birthday: '1999-01-01',
              postal: '1578512',
              pref_id: 13,
              pref_name: '東京都',
              address1: '渋谷区桜丘町26-1',
              address2: 'セルリアンタワー',
              mail: 'example@pepabo.com',
              tel: null,
              fax: null,
              tel_mobile: '080-1234-1234',
              other: null,
              points: 216,
              member: true,
              sales_count: 3,
              receive_mail_magazine: true,
              answer_free_form1: 'これはフリー項目1の入力内容です',
              answer_free_form2: 'これはフリー項目2の入力内容です',
              answer_free_form3: 'これはフリー項目3の入力内容です',
              make_date: 1465784944,
              update_date: 1494496809,
              membership: {
                membership_id: 'gold_member',
                name: 'ゴールド会員',
                progress: {
                  score: 3000,
                  aggregation_period: {
                    start_date: 1780239600,
                    end_date: 1782831599,
                  },
                  next_membership: {
                    membership_id: 'platinum',
                    name: 'プラチナ会員',
                    required_score: 4000,
                    remaining_score: 1000,
                  },
                },
              },
              external_accounts: [
                {
                  provider: 0,
                  uid: '6cfd46d2fd18eb15d01ce0a00d4b0349',
                  created_at: 1465784934,
                },
              ],
            },
            details: [
              {
                id: 44344599,
                sale_id: 4434233,
                account_id: 'PA01234567',
                product_id: 1342332,
                sale_delivery_id: 1173289,
                option1_value: '赤',
                option2_value: 'Sサイズ',
                option1_index: 0,
                option2_index: 0,
                product_model_number: 'T-RED-S-223',
                product_name: 'Tシャツ',
                pristine_product_full_name: 'Tシャツ（カラー：赤、サイズ：Sサイズ）',
                product_cost: 1000,
                product_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123.jpg?20130319164314',
                product_thumbnail_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_th.jpg?20130319164314',
                product_mobile_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_mb.jpg?20130319164314',
                price: 1680,
                price_with_tax: 1814,
                product_num: 1,
                unit: '枚',
                subtotal_price: 1814,
                tax_reduced: false,
                customizations: [
                  {
                    title: '名入れ',
                    value: 'オリジナル名',
                  },
                ],
              },
            ],
            sale_deliveries: [
              {
                id: 1173289,
                account_id: 'PA01234567',
                sale_id: 4434233,
                delivery_id: 113922,
                detail_ids: [
                  44344599,
                ],
                name: 'ペパボ太郎',
                furigana: 'ペパボタロウ',
                postal: '1508512',
                pref_id: 13,
                pref_name: '東京都',
                address1: '渋谷区桜丘町26-1',
                address2: 'セルリアンタワー',
                tel: null,
                preferred_date: '2017-05-21',
                preferred_period: '午前中',
                slip_number: '1234-5678-9012',
                noshi_text: '寿',
                noshi_charge: 100,
                card_name: 'バースデーカード',
                card_text: 'おめでとう',
                card_charge: 150,
                wrapping_name: 'ギフト用ラッピング（ピンク）',
                wrapping_charge: 200,
                delivery_charge: 350,
                total_charge: 800,
                tracking_url: 'https://example.com/delivery_state?id=111-222-33333',
                memo: null,
                delivered: false,
              },
            ],
            segment: {
              id: 1,
              name: 'string',
              parent_sale_id: 4434233,
              splitted: true,
              product_total_price: 2000,
              delivery_total_charge: 700,
              total_price: 2700,
              noshi_total_charge: 0,
              card_total_charge: 200,
              wrapping_total_charge: 0,
            },
            totals: {
              normal_tax_amount: 90,
              reduced_tax_amount: 13,
              discount_amount_for_normal_tax: 171,
              discount_amount_for_reduced_tax: 29,
              total_price_with_normal_tax: 989,
              total_price_with_reduced_tax: 171,
            },
            application: {
              name: 'サンプルアプリ',
            },
            shop_coupon: {
              id: 123,
              name: '新規会員限定クーポン',
              code: 'WELCOME10',
            },
          },
        ],
        meta: {
          total: 300,
          limit: 50,
          offset: 200,
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getSalesV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.meta !== undefined)
    assert(json.sales !== undefined)
    expect(json.meta.total).toBe(300)
    expect(json.sales[0].id).toBe(4434233)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/sales', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getSalesV1()({})
    assert(response.ok === false)
  })
})

describe('getSaleV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/sales/4434233', method: 'GET' }).reply(200,
      {
        sale: {
          id: 4434233,
          account_id: 'PAXXXXXXXX',
          make_date: 1465784934,
          update_date: 1494496895,
          payment_id: 751,
          mobile: false,
          paid: true,
          delivered: true,
          canceled: false,
          accepted_mail_state: 'not_yet',
          paid_mail_state: 'not_yet',
          delivered_mail_state: 'not_yet',
          accepted_mail_sent_date: 1363152822,
          paid_mail_sent_date: 1363153288,
          delivered_mail_sent_date: 1363154591,
          point_state: 'assumed',
          gmo_point_state: 'assumed',
          yahoo_point_state: 'assumed',
          product_total_price: 1000,
          delivery_total_charge: 350,
          fee: 300,
          tax: 80,
          noshi_total_charge: 0,
          card_total_charge: 200,
          wrapping_total_charge: 0,
          point_discount: 0,
          gmo_point_discount: 0,
          other_discount: 0,
          other_discount_name: '',
          total_price: 1930,
          granted_points: 100,
          use_points: 0,
          granted_gmo_points: 0,
          use_gmo_points: 0,
          granted_yahoo_points: 0,
          use_yahoo_points: 0,
          external_order_id: 'ABC0123456789',
          customer: {
            id: 998273,
            account_id: 'PA01234567',
            name: 'カラーミー太郎',
            furigana: 'カラーミータロウ',
            hojin: 'GMOペパボ株式会社',
            busho: 'EC事業部',
            sex: 'male',
            birthday: '1999-01-01',
            postal: '1578512',
            pref_id: 13,
            pref_name: '東京都',
            address1: '渋谷区桜丘町26-1',
            address2: 'セルリアンタワー',
            mail: 'example@pepabo.com',
            tel: null,
            fax: null,
            tel_mobile: '080-1234-1234',
            other: null,
            points: 216,
            member: true,
            sales_count: 3,
            receive_mail_magazine: true,
            answer_free_form1: 'これはフリー項目1の入力内容です',
            answer_free_form2: 'これはフリー項目2の入力内容です',
            answer_free_form3: 'これはフリー項目3の入力内容です',
            make_date: 1465784944,
            update_date: 1494496809,
            membership: {
              membership_id: 'gold_member',
              name: 'ゴールド会員',
              progress: {
                score: 3000,
                aggregation_period: {
                  start_date: 1780239600,
                  end_date: 1782831599,
                },
                next_membership: {
                  membership_id: 'platinum',
                  name: 'プラチナ会員',
                  required_score: 4000,
                  remaining_score: 1000,
                },
              },
            },
            external_accounts: [
              {
                provider: 0,
                uid: '6cfd46d2fd18eb15d01ce0a00d4b0349',
                created_at: 1465784934,
              },
            ],
          },
          details: [
            {
              id: 44344599,
              sale_id: 4434233,
              account_id: 'PA01234567',
              product_id: 1342332,
              sale_delivery_id: 1173289,
              option1_value: '赤',
              option2_value: 'Sサイズ',
              option1_index: 0,
              option2_index: 0,
              product_model_number: 'T-RED-S-223',
              product_name: 'Tシャツ',
              pristine_product_full_name: 'Tシャツ（カラー：赤、サイズ：Sサイズ）',
              product_cost: 1000,
              product_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123.jpg?20130319164314',
              product_thumbnail_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_th.jpg?20130319164314',
              product_mobile_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_mb.jpg?20130319164314',
              price: 1680,
              price_with_tax: 1814,
              product_num: 1,
              unit: '枚',
              subtotal_price: 1814,
              tax_reduced: false,
              customizations: [
                {
                  title: '名入れ',
                  value: 'オリジナル名',
                },
              ],
            },
          ],
          sale_deliveries: [
            {
              id: 1173289,
              account_id: 'PA01234567',
              sale_id: 4434233,
              delivery_id: 113922,
              detail_ids: [
                44344599,
              ],
              name: 'ペパボ太郎',
              furigana: 'ペパボタロウ',
              postal: '1508512',
              pref_id: 13,
              pref_name: '東京都',
              address1: '渋谷区桜丘町26-1',
              address2: 'セルリアンタワー',
              tel: null,
              preferred_date: '2017-05-21',
              preferred_period: '午前中',
              slip_number: '1234-5678-9012',
              noshi_text: '寿',
              noshi_charge: 100,
              card_name: 'バースデーカード',
              card_text: 'おめでとう',
              card_charge: 150,
              wrapping_name: 'ギフト用ラッピング（ピンク）',
              wrapping_charge: 200,
              delivery_charge: 350,
              total_charge: 800,
              tracking_url: 'https://example.com/delivery_state?id=111-222-33333',
              memo: null,
              delivered: false,
            },
          ],
          segment: {
            id: 1,
            name: 'string',
            parent_sale_id: 4434233,
            splitted: true,
            product_total_price: 2000,
            delivery_total_charge: 700,
            total_price: 2700,
            noshi_total_charge: 0,
            card_total_charge: 200,
            wrapping_total_charge: 0,
            siblings_sale_ids: [
              4434233,
              4434234,
            ],
          },
          totals: {
            normal_tax_amount: 90,
            reduced_tax_amount: 13,
            discount_amount_for_normal_tax: 171,
            discount_amount_for_reduced_tax: 29,
            total_price_with_normal_tax: 989,
            total_price_with_reduced_tax: 171,
          },
          application: {
            name: 'サンプルアプリ',
          },
          shop_coupon: {
            id: 123,
            name: '新規会員限定クーポン',
            code: 'WELCOME10',
          },
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getSaleV1()({
      params: {
        path: {
          sale_id: 4434233,
        },
      },
    })
    assert(response.ok)

    const json = await response.json()
    assert(json.sale !== undefined)

    expect(json.sale.id).toBe(4434233)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/sales/4434233', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getSaleV1()({
      params: {
        path: {
          sale_id: 4434233,
        },
      },
    })
    assert(response.ok === false)
  })
})

describe('getProductsV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/products', method: 'GET' }).reply(200,
      {
        products: [
          {
            account_id: 'PA01234567',
            id: 1342332,
            name: 'Tシャツ',
            stocks: 20,
            stock_managed: false,
            few_num: 5,
            model_number: 'T-223',
            category: {
              id_big: 13223,
              id_small: 18447,
            },
            group_ids: [
              5456,
              62098,
            ],
            display_state: 'showing',
            sales_price: 1980,
            sales_price_including_tax: 2178,
            sales_price_tax: 198,
            price: null,
            members_price: 1680,
            members_price_including_tax: 1848,
            members_price_tax: 168,
            cost: null,
            delivery_charge: null,
            cool_charge: null,
            unavailable_payment_ids: [
              600001,
              600002,
            ],
            unavailable_delivery_ids: [
              400001,
              400002,
            ],
            min_num: null,
            max_num: null,
            sale_start_date: null,
            sale_end_date: null,
            unit: null,
            weight: null,
            soldout_display: true,
            sort: 2,
            simple_expl: '素材にこだわってつくった、弊社の人気商品です。',
            expl: '綿100%のこだわりTシャツです。\n\n肌触りや吸水性の良さにみなさま驚かれます。弊社の人気商品です。\n',
            mobile_expl: null,
            smartphone_expl: null,
            make_date: 1465784934,
            update_date: 1494496895,
            memo: '',
            image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123.jpg?20130319164314',
            mobile_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_mb.jpg?20130319164314',
            thumbnail_image_url: 'https://img07.shop-pro.jp/XXX/XX/product/123_th.jpg?20130319164314',
            images: [
              {
                src: 'string',
                position: 1,
                mobile: true,
              },
            ],
            options: [
              {
                id: 539903,
                product_id: 1342332,
                account_id: 'PA01234567',
                name: '色',
                values: [
                  '赤',
                  '白',
                ],
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            variants: [
              {
                id: 123456,
                product_id: 1342332,
                account_id: 'PA01234567',
                option1_value: '赤',
                option2_value: 'S',
                option1: {
                  id: 1,
                  name: '色',
                  value_id: 1,
                  value: '赤',
                },
                option2: {
                  id: 2,
                  name: 'サイズ',
                  value_id: 1,
                  value: 'S',
                },
                title: '赤　x　S',
                stocks: 20,
                few_num: 5,
                model_number: 'T-RED-S-223',
                weight: 150,
                option_market_price: 300,
                option_cost: 80,
                option_price: 1980,
                option_price_including_tax: 2178,
                option_price_tax: 198,
                option_members_price: 100,
                option_members_price_including_tax: 110,
                option_members_price_tax: 10,
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            pickups: [
              {
                pickup_type: 0,
                order_num: 0,
                make_date: 1465784944,
                update_date: 1494496809,
              },
            ],
            // The OpenAPI specification describes `digital_conent` but it might be typo.
            digital_content: false,
            regular_purchase: false,
            tax_reduced: false,
            without_shipping: false,
          },
        ],
        meta: {
          total: 300,
          limit: 50,
          offset: 200,
        },
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getProductsV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.meta !== undefined)
    assert(json.products !== undefined)

    expect(json.meta.total).toBe(300)
    expect(json.products[0].account_id).toBe('PA01234567')
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/products', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getProductsV1()({})
    assert(response.ok === false)
  })
})

describe('getCouponsV1', () => {
  test('ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop_coupons', method: 'GET' }).reply(200,
      {
        shop_coupons: [
          {
            id: 187239,
            name: '100円割引',
            code: 'discount100',
            coupon_type: 'amount',
            discount_amount: 50,
            minimum_amount: 1000,
            starts_at: 1465784934,
            ends_at: 1465784934,
            total_usage_limit: 10,
            usage_limit: 'indisposable',
            group_limit_type: 'none',
            status: 'unavailable',
            created_at: 1465784934,
            updated_at: 1465784934,
            group_ids: [
              1,
              2,
              3,
            ],
          },
        ],
      },
    )

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getCouponsV1()({})
    assert(response.ok)

    const json = await response.json()
    assert(json.shop_coupons !== undefined)

    expect(json.shop_coupons[0].id).toBe(187239)
  })

  test('not ok', async () => {
    const mockAgent = new MockAgent({ connections: 1 })
    const mockClient = mockAgent.get(BASE_URL)

    mockClient.intercept({ path: '/v1/shop_coupons', method: 'GET' }).reply(500)

    const client = new ColormeApiClient(mockClient)

    const { response } = await client.getCouponsV1()({})
    assert(response.ok === false)
  })
})
