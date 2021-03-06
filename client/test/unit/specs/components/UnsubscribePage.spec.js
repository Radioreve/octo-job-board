import Vue from 'vue';
import AppHeader from '@/components/AppHeader';
import UnsubscribePage from '@/components/UnsubscribePage';
import authenticationService from '@/services/authentication';
import notificationService from '@/services/notification';
import subscriptionsApi from '@/api/subscriptions';

describe('Unit | Component | UnsubscribePage.vue', () => {
  let component;

  beforeEach(() => {
    const Constructor = Vue.extend(UnsubscribePage);
    component = new Constructor().$mount();
  });

  it('should be named "UnsubscribePage"', () => {
    expect(component.$options.name).to.equal('UnsubscribePage');
  });

  it('should include AppHeader', () => {
    const appHeader = component.$options.components.AppHeader;
    expect(appHeader).to.contain(AppHeader);
  });

  describe('#unsubscribe', () => {
    beforeEach(() => {
      sinon.stub(authenticationService, 'getAccessToken').returns('fake token');
      sinon.stub(notificationService, 'success');
      sinon.stub(notificationService, 'error');
      sinon.stub(subscriptionsApi, 'unsubscribe');
    });

    afterEach(() => {
      authenticationService.getAccessToken.restore();
      notificationService.success.restore();
      notificationService.error.restore();
      subscriptionsApi.unsubscribe.restore();
    });

    it('should call subscriptionsApi with accessToken', () => {
      // given
      subscriptionsApi.unsubscribe.resolves();

      // when
      component.unsubscribe();

      // then
      expect(subscriptionsApi.unsubscribe).to.have.been.calledWithExactly('fake token');
    });

    it('should display success toast notification when subscription succeeds', () => {
      // given
      subscriptionsApi.unsubscribe.resolves();

      // when
      component.unsubscribe();

      // then
      return Vue.nextTick().then(() => {
        const message = 'Ton désabonnement aux alertes du Job Board a été pris en compte.';
        expect(notificationService.success).to.have.been.calledWithExactly(component, message);
      });
    });

    it('should display error toast notification when subscription fails', () => {
      // given
      subscriptionsApi.unsubscribe.rejects();

      // when
      component.unsubscribe();

      // then
      return Vue.nextTick().then(() => {
        const message = 'Erreur lors de la prise en compte de ton désabonnement.';
        expect(notificationService.error).to.have.been.calledWithExactly(component, message);
      });
    });
  });
});
