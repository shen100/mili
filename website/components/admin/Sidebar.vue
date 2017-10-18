    <template>
    <Menu theme="dark" active-name="1">
        <Menu-group title="内容管理">
            <router-link to="/admin/article/list">
                <Menu-item name="1">
                    <Icon type="/admin/document-text"></Icon>
                    话题管理
                </Menu-item>
            </router-link>
            <router-link to="/admin/category/list">
                <Menu-item name="2">
                    <Icon type="pricetags"></Icon>
                     分类管理
                </Menu-item>
            </router-link>
            <Menu-item name="3">
                <Icon type="chatbubbles"></Icon>
                评论管理
            </Menu-item>
        </Menu-group>
        <Menu-group title="统计分析">
            <router-link to="/admin/user/list">
                <Menu-item name="3">
                    <Icon type="heart"></Icon>
                    用户管理
                </Menu-item>
            </router-link>
            <Menu-item name="4">
                <Icon type="heart-broken"></Icon>
                流失用户
            </Menu-item>
        </Menu-group>
    </Menu>
</template>