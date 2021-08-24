import { FC } from "react";

type props = {
  fill: string;
}

export const CheckIcon: FC<props> = ({fill}:props) => (
  <svg viewBox="0 0 20 21" fill={fill} xmlns="http://www.w3.org/2000/svg">
    <path d="M12.72 7.29L8.43001 11.59L6.78 9.94C6.69036 9.83532 6.58004 9.7503 6.45597 9.69027C6.33191 9.63025 6.19678 9.59652 6.05906 9.5912C5.92134 9.58588 5.78401 9.60909 5.65568 9.65936C5.52736 9.70964 5.41081 9.78589 5.31335 9.88335C5.2159 9.9808 5.13964 10.0974 5.08937 10.2257C5.03909 10.354 5.01589 10.4913 5.02121 10.6291C5.02653 10.7668 5.06026 10.9019 5.12028 11.026C5.1803 11.15 5.26532 11.2604 5.37 11.35L7.72 13.71C7.81344 13.8027 7.92426 13.876 8.0461 13.9258C8.16794 13.9755 8.2984 14.0008 8.43001 14C8.69234 13.9989 8.94374 13.8947 9.13 13.71L14.13 8.71C14.2237 8.61704 14.2981 8.50644 14.3489 8.38458C14.3997 8.26272 14.4258 8.13201 14.4258 8C14.4258 7.86799 14.3997 7.73728 14.3489 7.61542C14.2981 7.49356 14.2237 7.38296 14.13 7.29C13.9426 7.10375 13.6892 6.99921 13.425 6.99921C13.1608 6.99921 12.9074 7.10375 12.72 7.29ZM10 0.5C8.02219 0.5 6.08879 1.08649 4.4443 2.1853C2.79981 3.28412 1.51809 4.8459 0.761209 6.67317C0.00433284 8.50043 -0.193701 10.5111 0.192152 12.4509C0.578004 14.3907 1.53041 16.1725 2.92894 17.5711C4.32746 18.9696 6.10929 19.922 8.0491 20.3079C9.98891 20.6937 11.9996 20.4957 13.8268 19.7388C15.6541 18.9819 17.2159 17.7002 18.3147 16.0557C19.4135 14.4112 20 12.4778 20 10.5C20 9.18678 19.7413 7.88642 19.2388 6.67317C18.7363 5.45991 17.9997 4.35752 17.0711 3.42893C16.1425 2.50035 15.0401 1.76375 13.8268 1.2612C12.6136 0.758658 11.3132 0.5 10 0.5ZM10 18.5C8.41775 18.5 6.87104 18.0308 5.55544 17.1518C4.23985 16.2727 3.21447 15.0233 2.60897 13.5615C2.00347 12.0997 1.84504 10.4911 2.15372 8.93928C2.4624 7.38743 3.22433 5.96197 4.34315 4.84315C5.46197 3.72433 6.88743 2.9624 8.43928 2.65372C9.99113 2.34504 11.5997 2.50346 13.0615 3.10896C14.5233 3.71447 15.7727 4.73984 16.6518 6.05544C17.5308 7.37103 18 8.91775 18 10.5C18 12.6217 17.1572 14.6566 15.6569 16.1569C14.1566 17.6571 12.1217 18.5 10 18.5Z" />
  </svg>
);