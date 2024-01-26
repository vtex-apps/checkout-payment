# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.16.2] - 2024-01-26

### Changed

- Bump `card-form-ui` version to `0.10.0` to use new translations

## [0.16.1] - 2022-05-04

### Changed

- Bump `card-form-ui` version to `0.9.2`

## [0.16.0] - 2021-05-25

### Added
- Basic Promissory payment component

## [0.15.0] - 2021-04-26

### Added
- I18n Fi, Fr, Nl, No, Ro and Sl.

### Changed
- Crowdin configuration file.

## [0.14.1] - 2021-03-23
### Fixed
- `bin` and `accountId` payment fields when the user enters a new credit card.
- The selected default address is never being sent

## [0.14.0] - 2021-03-15

### Added
- CSS handles to the extra data section

## [0.13.1] - 2021-02-23
### Fixed
- Validation on billing address form.

## [0.13.0] - 2021-02-12
### Added
- Do not show the document field if the selected payment system does not require

## [0.12.0] - 2021-01-18
### Added
- Free purchase summary 

## [0.11.3] - 2021-01-07
### Fixed
- Billing address crash when address rules is empty.

## [0.11.2] - 2020-12-18
### Fixed
- Error when `PaymentItem#label` isn't a string.

## [0.11.1] - 2020-12-11
### Added
- `id` to the payment methods.

## [0.11.0] - 2020-11-19
### Added
- Billing address form in extra data stage.

## [0.10.0] - 2020-11-13
### Added
- Modal with all available credit cards installment options.

### Changed
- Move installment options list to a modal.

### Fixed
- Iframe height not properly calculated in some scenarios.

## [0.9.0] - 2020-07-15
### Changed
- Update card form filled status via the `setCardFormFilled` function in payment context.

## [0.8.0] - 2020-06-29
### Added
- Support for saved credit cards.

### Changed
- Updated `card-form-ui` version to `v0.7.1`.

## [0.7.0] - 2020-06-22
### Added
- Support for boleto payment method.

## [0.6.0] - 2020-06-05
### Added
- Id `chk-card-form` to the `iframe` containing the card form.

### Changed
- Usages of `encryptedCard` listener to use `getLastCardDigits` and `isCardValid` listeners.
- Updated `card-form-ui` version to `v0.6.0`.

## [0.5.0] - 2020-05-18
### Added
- Payment summary component.
- Installment options list after filling credit card form.
- Payment options list.

## [0.4.0] - 2020-03-30
### Added
- Send `paymentSystems` to iframe.
- `DocumentField` to `CreditCard`
- Save `paymentData`

## [0.3.0] - 2020-03-09
### Added
- Add `i18n`.
- Send `locale` to iframe

## [0.2.2] - 2019-12-23

## [0.2.1] - 2019-11-19

## [0.2.0] - 2019-11-18

## [0.1.0] - 2019-09-23
### Added
- Test example for VTEX IO app.

## Changed
- Removed `injectIntl` from example
- **Component** Create the VTEX Store Component _IO Base App_
