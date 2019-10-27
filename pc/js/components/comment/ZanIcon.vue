<template>
    <svg aria-hidden="true" width="16" height="16" viewBox="0 0 20 20" class="icon like-icon">
        <g fill="none" fill-rule="evenodd">
            <path d="M0 0h20v20H0z"></path>
            <path :stroke="stroke" :fill="fill" stroke-linejoin="round" d="M4.58 8.25V17h-1.4C2.53 17 2 16.382 2 15.624V9.735c0-.79.552-1.485 1.18-1.485h1.4zM11.322 2c1.011.019 1.614.833 1.823 1.235.382.735.392 1.946.13 2.724-.236.704-.785 1.629-.785 1.629h4.11c.434 0 .838.206 1.107.563.273.365.363.84.24 1.272l-1.86 6.513A1.425 1.425 0 0 1 14.724 17H6.645V7.898C8.502 7.51 9.643 4.59 9.852 3.249A1.47 1.47 0 0 1 11.322 2z"></path>
        </g>
    </svg>
</template>

<script>
export default {
    props: ['active'],
    computed: {
        stroke() {
            return this.active ? '#37c700' : '#8A93A0';
        },
        fill() {
            return this.active ? '#37c700' : '#fff';
        },
    },
    data() {
        return {

        };
    }
}
</script>