
type OneToAuto = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'auto'
interface GridProps {
    container?: boolean
    item?: boolean
    col?: OneToAuto
    xs?: OneToAuto
    sm?: OneToAuto
    md?: OneToAuto
    lg?: OneToAuto
    xl?: OneToAuto
    className?: string
}

function addSizeClass(props: GridProps, name: keyof GridProps, classes: string) {
    if (props[name]) {
        return `${classes  }col-${name}-${props[name]} `
    }
    return classes
}

export const Grid: React.FunctionComponent<GridProps> = (props) => {
    let classes = `${props.className || ''} `
    if (props.container) {
        classes += "columns "
    }
    if(props.item) {
        classes += "column "
    }
    if (props.col) {
        classes += `col-${props.col} `
    }
    for (const size of ['xs', 'sm', 'md', 'lg', 'xl'] as Array<keyof GridProps>) {
        classes = addSizeClass(props, size, classes)
    }

    return (
      <div className={classes.trim()}>
        {props.children}
      </div>
)
}

