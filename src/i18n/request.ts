import { hasLocale } from 'next-intl';
import { routing } from './routing';
import {getRequestConfig} from 'next-intl/server';
 
export default getRequestConfig(async ({ requestLocale }) => {

  let locale = await requestLocale;
 if(!hasLocale(routing.locales, locale)) locale = routing.defaultLocale;
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});