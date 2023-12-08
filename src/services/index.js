import * as Model from '../models'
import { WrapperService } from './WrapperService'

export const PlansService = WrapperService(Model.PlansModel)
export const SubscriptionService = WrapperService(Model.SubscriptionModel)
export const RequestedPincodeService = WrapperService(Model.RequestedPincodesModel)
export const LeadsService = WrapperService(Model.LeadsModel)
export const AngelService = WrapperService(Model.AngelsModel)
export const BookingsService = WrapperService(Model.BookingsModel)
export const CancelledBookingsService = WrapperService(Model.CancelledBookingsModel)
export const AngelCalendarService = WrapperService(Model.AngelCalendarModel)
export const LearningModulesService = WrapperService(Model.LearningModulesModel)
export const BookingActivityService = WrapperService(Model.BookingActivityModel)
export const PlanCodesService = WrapperService(Model.PlanCodesModel)
export const VouchersService = WrapperService(Model.VouchersModel)
export const VouchersClientService = WrapperService(Model.VouchersCleintModel)
