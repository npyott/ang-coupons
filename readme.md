# Ang Coupons

This app is a small project to facilitate a coupon book experience as either a
vendor or a consumer.

## User Experience Overview

### Consumer Experience

A consumer should be able to use this app to first see all of the coupon
collections they have, and then view all of the coupons within each collection.
For each coupon, a consumer may then place a request to the designated vendor
to have the coupon fulfilled. Then the contract will be handled outside of the
application, to be fulfilled or cancelled by the vendor as appropriate.

Coupon requests are fairly limited to the consumer. In the intermediate case
where the coupon status is pending, the consumer ought to be able to cancel the
request. Creating coupon requests is also fairly limited as the contract should
already be spelled out by the coupon itself.

There may be cases where multiple consumers can join together as a group in
order to consume a set of coupons. Each time an individual uses a coupon, it
then follows that the coupon is consumed more and more.

### Vendor Experience

A vendor should be able to use this app to create and oversee their coupons and
manage requests. The journey begins with a view of the existing coupon
templates where the vendor may then view all of the corresponding active
coupons for that template. Under each active coupon, it will then be the
concern to view active requests.

Potentially, another process which could be important for vendors is the design
process for coupon templates. This drafting phase may wish to be done
organizationally since you will wish to require admins for managing active
coupons to be distinct from the teams used for design. This brings about the
need for having permission systems since you may not want design teams to have
access for fulfilling coupon requests.

After a coupon is created, a vendor will wish to make their coupons accessible
to various consumers. This will necessitate an action for creating coupons for
groups of users from a template 


