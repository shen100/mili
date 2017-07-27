    <template>
    <Menu theme="dark" active-name="1">
        <Menu-group title="内容管理">
            <router-link to="/admin/article">
                <Menu-item name="1">
                    <Icon type="/admin/document-text"></Icon>
                    文章管理
                </Menu-item>
            </router-link>
            <router-link to="/admin/category/manage">
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
            <Menu-item name="3">
                <Icon type="heart"></Icon>
                用户留存
            </Menu-item>
            <Menu-item name="4">
                <Icon type="heart-broken"></Icon>
                流失用户
            </Menu-item>
        </Menu-group>
    </Menu>
</template>