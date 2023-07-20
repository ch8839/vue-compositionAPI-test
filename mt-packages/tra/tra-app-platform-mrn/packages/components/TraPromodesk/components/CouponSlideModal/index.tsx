import React from 'react'
import ListSlideModal from '../../../ListSlideModal'
import { PromoType } from '@nibfe/tra-app-platform-mrn-modules/services/requests/preorder'
import CouponList from '../CouponList/index'
import PremiumSlideModal from '../PremiumSlideModal/index'

const CouponSlideModal = (props) => {
    const { type, showSlideModal, setShowSlideModal, promoInfoList, amountDetail, selectedPromoId, setSelectedPromoId, closeSlideModal, onPromoDeskChange, couponListModuleClickLx, premiumCardPopupModuleViewLx } = props
    if(!promoInfoList) return null
    // 二级券列表弹窗的数据
    let data = promoInfoList?.find( item =>{
        return item.promoType === type 
    })
    const onClickConfirm = ()=>{
        onPromoDeskChange({selectedPromoId, operatorPromoType: type})
        setShowSlideModal(false)
        couponListModuleClickLx && couponListModuleClickLx()
    }
    if(type === PromoType.MERCHANT_COUPON) {
        return (
            <ListSlideModal
                title={"商家优惠券"}
                customContent= { 
                    <CouponList 
                        availableCouponList={data?.availableCouponList || []} 
                        unavailableCouponList={data?.unavailableCouponList || []}
                        selectedPromoId={selectedPromoId}
                        setSelectedPromoId={setSelectedPromoId}
                    />
                }
                onClickConfirm={
                    onClickConfirm
                }
                showSlideModal={showSlideModal}
                setShowSlideModal={setShowSlideModal}
            ></ListSlideModal>
        )
    } else if(type === PromoType.PLATFORM_COUPON) {
        return (
            <ListSlideModal
                title={"平台优惠券"}
                customContent= { 
                    <CouponList 
                        availableCouponList={data?.availableCouponList || []} 
                        unavailableCouponList={data?.unavailableCouponList || []}
                        selectedPromoId={selectedPromoId}
                        setSelectedPromoId={setSelectedPromoId}
                    />
                }
                onClickConfirm={
                    onClickConfirm
                }
                showSlideModal={showSlideModal}
                setShowSlideModal={setShowSlideModal}
            ></ListSlideModal>
        )
    } else if(type === PromoType.CARD_PROMO_AFTER_BUY_CARD || type === PromoType.CARD_PROMO_BEFORE_BUY_CARD) {
        if (showSlideModal) {
            // 会员优惠解释浮层曝光
            premiumCardPopupModuleViewLx && premiumCardPopupModuleViewLx()
        }
        const bookingPromoObj = promoInfoList?.find( item =>{
            return item.promoType === PromoType.BOOKING_PROMO 
        })
        const bookingPromo = bookingPromoObj?.promoAmount || ""
        const premiumSlideModalData = {
            promoAmount: data.promoAmount,
            discount: data.discount,
            bookingPromo,
            subTotalAmount: amountDetail?.subTotalAmount,
        }
        return (
            <PremiumSlideModal 
                data={premiumSlideModalData}
                showSlideModal={showSlideModal}
                closeSlideModal={closeSlideModal}
            />
        )
    }
    return null
}
export default CouponSlideModal
