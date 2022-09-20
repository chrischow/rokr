import './styles.css';

export function InfoIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      fill="currentColor"
      className="bi bi-info-circle"
      viewBox="0 0 16 16"
      style={{ paddingBottom: "3px" }}
    >
      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
    </svg>
  );
}

export function LaunchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      width="16"
      height="16"
      fill="currentColor"
      style={{ paddingBottom: "3px" }}
    >
      <path
        d="M256 64C256 46.33 270.3 32 288 32H415.1C415.1 32 415.1 32
                415.1 32C420.3 32 424.5 32.86 428.2 34.43C431.1 35.98 435.5
                38.27 438.6 41.3C438.6 41.35 438.6 41.4 438.7 41.44C444.9 47.66 
                447.1 55.78 448 63.9C448 63.94 448 63.97 448 64V192C448 209.7 
                433.7 224 416 224C398.3 224 384 209.7 384 192V141.3L214.6 
                310.6C202.1 323.1 181.9 323.1 169.4 310.6C156.9 298.1 156.9 
                277.9 169.4 265.4L338.7 96H288C270.3 96 256 81.67 256 64V64zM0 
                128C0 92.65 28.65 64 64 64H160C177.7 64 192 78.33 192 96C192 
                113.7 177.7 128 160 128H64V416H352V320C352 302.3 366.3 288 384 
                288C401.7 288 416 302.3 416 320V416C416 451.3 387.3 480 352 
                480H64C28.65 480 0 451.3 0 416V128z"
      />
    </svg>
  );
}

export function EditIcon() {
  return (
    <svg
      className="edit-icon"
      aria-hidden="false"
      focusable="false"
      data-prefix="fas"
      data-icon="pen-to-square"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M490.340.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3
                149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6
                21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3
                339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1
                385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2
                352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192
                63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192
                127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96
                448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1
                416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512
                352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96
                63.1H192z"
      ></path>
    </svg>
  );
}

export const editIconString = `<svg
class="edit-icon"
style="height:14px; width: 14px;"
aria-hidden="false"
focusable="false"
data-prefix="fas"
data-icon="pen-to-square"
role="img"
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 512 512"
data-fa-i2svg=""
>
<path
    fill="currentColor"
    d="M490.340.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3
    149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6
    21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3
    339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1
    385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2
    352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192
    63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192
    127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96
    448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1
    416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512
    352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96
    63.1H192z"
>
</path>
</svg>`;

interface EditIconTextProps {
  className: string;
}

export function EditIconText(props: EditIconTextProps) {
  return (
    <svg
      aria-hidden="false"
      focusable="false"
      data-prefix="fas"
      data-icon="pen-to-square"
      role="text"
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M490.340.4C512.2 62.27 512.2 97.73 490.3 119.6L460.3
                149.7L362.3 51.72L392.4 21.66C414.3-.2135 449.7-.2135 471.6
                21.66L490.3 40.4zM172.4 241.7L339.7 74.34L437.7 172.3L270.3
                339.6C264.2 345.8 256.7 350.4 248.4 353.2L159.6 382.8C150.1
                385.6 141.5 383.4 135 376.1C128.6 370.5 126.4 361 129.2
                352.4L158.8 263.6C161.6 255.3 166.2 247.8 172.4 241.7V241.7zM192
                63.1C209.7 63.1 224 78.33 224 95.1C224 113.7 209.7 127.1 192
                127.1H96C78.33 127.1 64 142.3 64 159.1V416C64 433.7 78.33 448 96
                448H352C369.7 448 384 433.7 384 416V319.1C384 302.3 398.3 287.1
                416 287.1C433.7 287.1 448 302.3 448 319.1V416C448 469 405 512
                352 512H96C42.98 512 0 469 0 416V159.1C0 106.1 42.98 63.1 96
                63.1H192z"
      ></path>
    </svg>
  );
}

export function CaretIcon() {
  return (
    <svg
      className="fa-caret-right collapse-icon"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="caret-right"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 512"
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M118.6 105.4l128 127.1C252.9 239.6 256
            247.8 256 255.1s-3.125 16.38-9.375 22.63l-128 127.1c-9.156 9.156-22.91
            11.9-34.88 6.943S64 396.9 64 383.1V128c0-12.94 7.781-24.62 19.75-29.58S109.5
            96.23 118.6 105.4z"
      ></path>
    </svg>
  );
}

interface AddIconTextProps {
  className: string;
}

export function AddIconText(props: AddIconTextProps) {
  return (
    <svg
      aria-hidden="false"
      focusable="false"
      role="text"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={props.className}
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 
            31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 
            32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 
            32.01v144h144C417.7 224 432 238.3 432 256z"
      />
    </svg>
  );
}

interface AlertIconTextProps {
  className: string;
}

export function AlertIconText(props: AlertIconTextProps) {
  return (
    <svg 
      aria-hidden="false"
      focusable="false"
      role="text"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className={props.className}
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M256 32V51.2C329 66.03 384 130.6 384 208V226.8C384 273.9 401.3 319.2 
        432.5 354.4L439.9 362.7C448.3 372.2 450.4 385.6 445.2 397.1C440 408.6 
        428.6 416 416 416H32C19.4 416 7.971 408.6 2.809 397.1C-2.353 385.6-.2883 
        372.2 8.084 362.7L15.5 354.4C46.74 319.2 64 273.9 64 226.8V208C64 130.6 
        118.1 66.03 192 51.2V32C192 14.33 206.3 0 224 0C241.7 0 256 14.33 256 
        32H256zM224 512C207 512 190.7 505.3 178.7 493.3C166.7 481.3 160 464.1 160 
        448H288C288 464.1 281.3 481.3 269.3 493.3C257.3 505.3 240.1 512 224 512z"
      />
    </svg>
  );
}