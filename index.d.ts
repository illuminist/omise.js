export type Currency = 'THB'

export type SourceInstallment = 
  | 'installment_bay'
  | 'installment_bbl'
  | 'installment_first_choice'
  | 'installment_kbank'
  | 'installment_ktc'

export type SourceInternetBanking =
  | 'internet_banking_bay'
  | 'internet_banking_bbl'
  | 'internet_banking_ktb'
  | 'internet_banking_scb'

export type SourceType =
  | 'alipay'
  | 'barcode_alipay'
  | 'bill_payment_tesco_lotus'
  | 'econtext'
  | 'points_citi'
  | 'truemoney'
  | SourceInstallment
  | SourceInternetBanking

export type BaseSourceOption = {
  amount: number
  currency: Currency
}

export type BarcodeAlipayOption = BaseSourceOption & {
  barcode: string 
  references: string
  store_id: string
  store_name: string
  terminal_id: string
}

export type TrueMoneyOption = BaseSourceOption & {
  phone_number: string
}

export type SourceOption = BarcodeAlipayOption | TrueMoneyOption | BaseSourceOption

export type ObjectType = 'source' | 'token'

export type TokenType = 'card'

export type Card = {
  expiration_month:  number  
  // (required) Card expiration month (M or MM).

  expiration_year:  number  
  // (required) Card expiration year (YY or YYYY).

  name:  string  
  // (required) Card owner name.

  number:  string  
  // (required) Card number.

  city?:  string  
  // (optional, but recommended) Billing address city.

  country?:  string  
  // (optional, but recommended) Billing address country as two-letter ISO 3166 code. Note: if not supplied at token creation, value derived from issuer identification number (IIN) so may not be accurate.

  phone_number?:  string  
  // (optional, but recommended) Billing address phone number.

  postal_code?:  string  
  // (optional, but recommended) Card postal code.

  security_code?:  string  
  // (optional, but recommended) Card security code (CVV, CVC, etc). Printed on the back.

  state?:  string  
  // (optional, but recommended) Billing address state.

  street1?:  string  
  // (optional, but recommended) Billing address street #1.

  street2?:  string  
  // (optional, but recommended) Billing address street #2.
}

interface BaseResponse {
  object: ObjectType,
  id: string,
  livemode: boolean,
  location: string,
  created_at: string,
}

interface SourceResponse<T extends BaseSourceOption> extends BaseResponse, T {
  flow: 'offline' | 'redirect',
  type: SourceType,
}

interface TokenResponse extends BaseResponse {
  card: Card & { id: string }
  used: boolean
}

namespace Omise {
  const publicKey: string

  function setPublicKey(publicKey: string): void
  // createSource(type: SourceType, options: SourceOption, callback)
  function createSource(
    type: Extract<SourceType, 'truemoney'>,
    options: TrueMoneyOption
  ): Promise<[number, SourceResponse<TrueMoneyOption>]>
  function createSource(
    type: Extract<SourceType, 'truemoney'>,
    options: TrueMoneyOption,
    callback: (status: number, data: SourceResponse<TrueMoneyOption>) => void
  ): void

  function createSource(
    type: SourceType,
    options: BaseSourceOption
  ): Promise<[number, SourceResponse<BaseSourceOption>]>
  function createSource(
    type: SourceType,
    options: BaseSourceOption,
    callback: (status: number, data: SourceResponse<TrueMoneyOption>) => void
  ): void


  function createToken(as: 'card', attributes: Card, handler: (status: number, response: TokenResponse) => void): void
  function createToken(as: 'card', attributes: Card) => Promise<[number, TokenResponse]>

}

export default Omise
