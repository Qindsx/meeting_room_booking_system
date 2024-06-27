import { Outlet } from "react-router-dom";
import { Menu as AntdMenu, MenuProps } from 'antd';
import './menu.css';
import { MenuClickEventHandler } from 'rc-menu/lib/interface'
import { router } from "../..";

const items: MenuProps['items'] = [
    {
        key: '1',
        label: "会议室管理"
    },
    {
        key: '2',
        label: "预定管理"
    },
    {
        key: '3',
        label: "用户管理"
    },
    {
        key: '4',
        label: "统计"
    }
];
const handleMenuItemClick: MenuClickEventHandler = (info: { key: string; }) => {

    switch (info.key) {
        case '1':
            router.navigate('/meeting_room_manage')
            break;
        case '2':
            break;
        case '3':
            router.navigate('/user_manage')
            break;

        default:
            break;
    }
}

export function Menu() {
    return <div id="menu-container">
        <div className="menu-area">
            <AntdMenu
                defaultSelectedKeys={['3']}
                items={items}
                onClick={handleMenuItemClick}
            />
        </div>
        <div className="content-area">
            <Outlet></Outlet>
        </div>
    </div>
}
