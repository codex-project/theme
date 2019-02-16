import { NotificationApi } from 'antd/lib/notification';
import { ArgsProps } from 'antd/es/notification';
import { notification } from 'antd';

export function createNotificationApi(): NotificationApi {
    let api: Partial<NotificationApi> = {};
    let apiFunctionNames              = [ 'success', 'error', 'info', 'warn', 'warning', 'open' ];
    apiFunctionNames.forEach(key => {
        api[ key ] = (props: ArgsProps) => {
            props = {
                className: 'c-notification',
                ...props,
            };
            return notification[ key ](props);
        };
    });
    Object.keys(notification).filter(key => ! apiFunctionNames.includes(key)).forEach(key => {
        api[ key ] = (...args) => notification[ key ](...args);
    });
    return api as NotificationApi;
}
