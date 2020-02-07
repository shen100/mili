import Vue from 'vue';
import SideMenu from './SideMenu.vue';

import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Icon,
    Menu,
    MenuItem,
    Tooltip,
} from 'iview';

Vue.component('Dropdown', Dropdown);
Vue.component('DropdownItem', DropdownItem);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('Icon', Icon);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Tooltip', Tooltip);

export default SideMenu;
