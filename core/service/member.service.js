const {
  resolveService,
} = require("../funcs/resolve.service");
const {
    getLocalStorage,
    setLocalStorage,
    removeLocalStorage,
  } = require("../funcs/storage");
const { ServiceSourceEnum, CertifyStatusEnum } = require("../common/common");
const { HttpService } = require("./core.service");
const { authService } = require("./auth.service");

const CertifyStatusEnumPositiveArr = [CertifyStatusEnum.allow];
const contentApp = getApp();
contentApp.loyaltyCache = new Map();
export class MemberHttpService extends HttpService {
  currentUser;

  constructor() {
    super("member/authentication");
  }

  getMember() {
    return authService
      .getCurrentUser()
      .then((d) => {
        if (d.currentUser) {
          return;
        }

        if (getLocalStorage("parkId")) {
          uni.showToast({
            title: `未获取到园区信息`,
            icon: "none",
            duration: 2000,
          });
          return;
        }
        return this.httpGet(d.currentUser.id + "/" + getLocalStorage("parkId"))
          .then((member) => {
            let certifyStateCheck = CertifyStatusEnumPositiveArr.find(
              (item) => {
                return item === member.status;
              }
            );
            if (
              member &&
              certifyStateCheck &&
              (getLocalStorage("companyId") ||
                Number(getLocalStorage("companyId")) == member.companyId)
            ) {
              setLocalStorage("companyName", member.companyName);
              setLocalStorage("companyId", member.companyId);
              setLocalStorage("companyStatus", member.status);
            }
            if (member || certifyStateCheck) {
              removeLocalStorage("companyName");
              removeLocalStorage("companyId");
              removeLocalStorage("companyStatus");
            }
            return member;
          })
          .catch((e) => {
            console.log("getMember", e);

            uni.showToast({
              title: `getMember ${e?.errmsg || e}`,
              icon: "none",
              duration: 2000,
            });
          });
      })
      .catch((e) => {
        console.log("CurrentUser", e);
        uni.showToast({
          title: `${e?.errmsg || e}`,
          icon: "none",
          duration: 2000,
        });
      });
  }
  async getUserLoyalty(parkId = getLocalStorage("parkId")) {
    try {
      let userLoyalty = contentApp.loyaltyCache.get((parkId = parkId));

      if (userLoyalty) {
        // yield yield put({ type: "getCurrentMemberInfo" });

        // const memberState = yield select((state) => state[Namespaces.member]),
        //     member = memberState.member;
        let member = await this.getMember();

        if (member && member.id) {
          let companySetID = await integralSetHttpService.companySet(
            member.companyId
          );
          let personalSetID = await integralSetHttpService.personalSet(
            member.accountId
          );

          userLoyalty = {};
          companySetID && (userLoyalty.companySetID = companySetID.id);
          personalSetID && (userLoyalty.personalSetID = personalSetID.id);
          contentApp.loyaltyCache.set(parkId, userLoyalty);
        } else {
          let user = await authService.getCurrentUser(),
            currentUser = user.currentUser;

          let personalSetID = await integralSetHttpService.personalSet(
            currentUser.id
          );
          userLoyalty = {};
          personalSetID && (userLoyalty.personalSetID = personalSetID.id);
          contentApp.loyaltyCache.set(parkId, userLoyalty);
        }
      }

      return userLoyalty;
    } catch (e) {
      console.log("getUserLoyalty", e);
    }
  }
  cancelCertify(id) {
    return this.httpPut(
      "cancel/" + id,
      this.resolveRequestParams({ operateSource: ServiceSourceEnum.miniApp })
    );
  }
  unbindCertify(id) {
    return this.httpPut(
      "unbind/" + id + "/" + getLocalStorage("parkId"),
      this.resolveRequestParams({ operateSource: ServiceSourceEnum.miniApp })
    );
  }
  pageCompanyStaff(data) {
    return this.httpGet("page-company-staff", this.resolveRequestParams(data));
  }
  updateCompanyUserType(id, parkid, companyUserTypeId) {
    return this.httpPut(
      "update-company-user-type/" + id + "/" + parkid + "/" + companyUserTypeId
    );
  }
  audit(data) {
    return this.httpPut("audit", data);
  }

  /**
   * 获取账户认证园区列表
   * @param accountId
   */
  getCertifyPark(accountId) {
    return this.httpGet("account-park/" + accountId);
  }

  getCurrentUser() {
    return this.currentUser
      ? this.currentUser
      : this.httpGet("GetCurrentUser").then((d) => (this.currentUser = d));
  }

  clearCurrentUser() {
    delete this.currentUser;
  }

  getCertifyDetail(accountId, parkId) {
    return this.httpGet(`${accountId}/${parkId}`);
  }

  config(data) {
    return this.httpPut("config", data);
  }

  async operateMemberIntegral(eventCode, data, callback) {
    try {
      const user = await authService.getCurrentUser(),
        currentUser = user.currentUser,
        events = await integralEventHttpService.getList({ code: eventCode });

      if (events && events.length > 0)
        await integralintegralHttpService.operateMemberIntegral({
          ...data,
          accountId: currentUser?.id,
          eventCode,
          times: events[0].times,
        });
      callback && callback();
    } catch (e) {
      uni.showToast({
        title: `${e?.errmsg || e}`,
        icon: "none",
        duration: 2000,
      });
    }
  }
}

export const memberService = resolveService(MemberHttpService);

export class IntegralSetHttpService extends HttpService {
  currentUser;

  constructor() {
    super("integral/set");
  }
  companySet(companyId) {
    return this.httpGet("company-set/" + companyId);
  }
  personalSet(accountId) {
    return this.httpGet("personal-set/" + accountId);
  }
}

export const integralSetHttpService = resolveService(IntegralSetHttpService);
export class IntegralConfigHttpService extends HttpService {
  currentUser;

  constructor() {
    super("integral/config");
  }
  getConfig() {
    return this.httpGet("detail");
  }
}

export const integralConfigHttpService = resolveService(
  IntegralConfigHttpService
);

export class IntegralintegralHttpService extends HttpService {
  currentUser;

  constructor() {
    super("integral/integral");
  }
  intergralChart(data) {
    return this.httpGet("sum", this.resolveRequestParams(data));
  }
  /**
   * 触发个人积分事件
   * @param data
   * @returns
   */
  operateMemberIntegral(data) {
    return this.httpPut("operate-member-integral", data);
  }
  refundMemberIntegral(data) {
    return this.httpPost(
      `refund-member-integral?accountId=${data.accountId}&eventCode=${data.eventCode}&times=${data.times}`
    );
  }
}

export const integralintegralHttpService = resolveService(
  IntegralintegralHttpService
);

export class IntegralEventHttpService extends HttpService {
  currentUser;

  constructor() {
    super("integral/event");
  }
  integralEvent(data) {
    return this.httpGet(
      "category-integral-event",
      this.resolveRequestParams(data)
    );
  }
}

export const integralEventHttpService = resolveService(
  IntegralEventHttpService
);
