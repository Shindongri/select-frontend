import axios from 'axios';
import * as qs from 'qs';

const BASE_URL_ACCOUNT_API = process.env.BASE_URL_ACCOUNT_API || 'https://account.ridibooks.com';

document.onreadystatechange = () => {
  if (document.readyState === 'complete') {
    const buttonToPayments = document.getElementsByClassName('js_ButtonToPaymentsRequest');

    const { return_url: returnUrl } = qs.parse(window.location.search, { ignoreQueryPrefix: true });

    Array.from(buttonToPayments).forEach((button: HTMLButtonElement) =>
      button.addEventListener('click', () => {
        button.disabled = true;

        // ridi-at의 TTL이 얼마 남지 않은 상황에서 PG사로 넘어가는 경우 콜백 페이지 도착 시 ridi-at가 파기될 수 있음
        // 이 경우 고객이 불편을 겪으므로 일단 token을 refresh 한 후 PG사로 이동 처리
        axios.post(`${BASE_URL_ACCOUNT_API}/ridi/token/`, null, { withCredentials: true })
          .then(response => {
            location.href = `/select/payments/request${returnUrl ? `?return_url=${returnUrl}` : ''}`;
          }).catch(e => {
            location.href = '/account/oauth-authorize?fallback=login';
        });
      }));
  }
}