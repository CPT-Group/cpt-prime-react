# CPT Prime React - Complete Component API Reference

This document provides a comprehensive reference for all CPT Prime React components, their props, types, and descriptions. All components are wrappers around PrimeReact components and maintain the same API.

**Version:** Compatible with PrimeReact ^10.9.7

## Table of Contents

1. [CPTAccordion](#cptaccordion)
2. [CPTAccordionTab](#cptaccordiontab)
3. [CPTAutoComplete](#cptautocomplete)
4. [CPTAvatar](#cptavatar)
5. [CPTAvatarGroup](#cptavatargroup)
6. [CPTBlockUI](#cptblockui)
7. [CPTBreadcrumb](#cptbreadcrumb)
8. [CPTButton](#cptbutton)
9. [CPTButtonGroup](#cptbuttongroup)
10. [CPTCalendar](#cptcalendar)
11. [CPTCard](#cptcard)
12. [CPTCarousel](#cptcarousel)
13. [CPTChart](#cptchart)
14. [CPTCheckbox](#cptcheckbox)
15. [CPTChip](#cptchip)
16. [CPTChips](#cptchips)
17. [CPTColorPicker](#cptcolorpicker)
18. [CPTColumn](#cptcolumn)
19. [CPTColumnGroup](#cptcolumngroup)
20. [CPTConfirmDialog](#cptconfirmdialog)
21. [CPTConfirmPopup](#cptconfirmpopup)
22. [CPTContextMenu](#cptcontextmenu)
23. [CPTDataTable](#cptdatatable)
24. [CPTDataView](#cptdataview)
25. [CPTDataViewLayoutOptions](#cptdataviewlayoutoptions)
26. [CPTDialog](#cptdialog)
27. [CPTDivider](#cptdivider)
28. [CPTDock](#cptdock)
29. [CPTDropdown](#cptdropdown)
30. [CPTEditor](#cpteditor)
31. [CPTFieldset](#cptfieldset)
32. [CPTFileUpload](#cptfileupload)
33. [CPTGalleria](#cptgalleria)
34. [CPTImage](#cptimage)
35. [CPTInplace](#cptinplace)
36. [CPTInplaceContent](#cptinplacecontent)
37. [CPTInplaceDisplay](#cptinplacedisplay)
38. [CPTInputMask](#cptinputmask)
39. [CPTInputNumber](#cptinputnumber)
40. [CPTInputSwitch](#cptinputswitch)
41. [CPTInputText](#cptinputtext)
42. [CPTInputTextarea](#cptinputtextarea)
43. [CPTKnob](#cptknob)
44. [CPTListbox](#cptlistbox)
45. [CPTMegaMenu](#cptmegamenu)
46. [CPTMenu](#cptmenu)
47. [CPTMenubar](#cptmenubar)
48. [CPTMessage](#cptmessage)
49. [CPTMeterGroup](#cptmetergroup)
50. [CPTMultiSelect](#cptmultiselect)
51. [CPTOrganizationChart](#cptorganizationchart)
52. [CPTOverlayPanel](#cptoverlaypanel)
53. [CPTPanel](#cptpanel)
54. [CPTPanelMenu](#cptpanelmenu)
55. [CPTPassword](#cptpassword)
56. [CPTProgressBar](#cptprogressbar)
57. [CPTProgressSpinner](#cptprogressspinner)
58. [CPTRadioButton](#cptradiobutton)
59. [CPTRating](#cptrating)
60. [CPTRow](#cptrow)
61. [CPTSelectButton](#cptselectbutton)
62. [CPTSidebar](#cptsidebar)
63. [CPTSkeleton](#cptskeleton)
64. [CPTSlideMenu](#cptslidemenu)
65. [CPTSlider](#cptslider)
66. [CPTSpeedDial](#cptspeeddial)
67. [CPTSplitButton](#cptsplitbutton)
68. [CPTSplitter](#cptsplitter)
69. [CPTSplitterPanel](#cptsplitterpanel)
70. [CPTSteps](#cptsteps)
71. [CPTTabPanel](#cpttabpanel)
72. [CPTTabView](#cpttabview)
73. [CPTTag](#cpttag)
74. [CPTTerminal](#cptterminal)
75. [CPTTieredMenu](#cpttieredmenu)
76. [CPTTimeline](#cpttimeline)
77. [CPTToast](#cpttoast)
78. [CPTToggleButton](#cpttogglebutton)
79. [CPTToolbar](#cpttoolbar)
80. [CPTTooltip](#cpttooltip)
81. [CPTTreeSelect](#cpttreeselect)
82. [CPTTreeTable](#cpttreetable)
83. [CPTTriStateCheckbox](#cpttristatecheckbox)
84. [CPTVirtualScroller](#cptvirtualscroller)

---

## CPTAccordion

**PrimeReact Component:** `accordion`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeIndex` | `number | number[] | null | undefined` | - | Active index or indexes of the element. Use an array of numbers for multiple indexes. The {@link ... |
| `multiple` | `boolean | undefined` | false | When enabled, multiple tabs can be activated at the same time. |
| `expandIcon` | `IconType<AccordionProps> | undefined` | - | Icon of a collapsed tab. |
| `collapseIcon` | `IconType<AccordionProps> | undefined` | - | Icon of an expanded tab. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 2 more props. See [PrimeReact accordion documentation](https://primereact.org/accordion/) for complete API.*

---

## CPTAccordionTab

**PrimeReact Component:** `accordiontab`

*Type definitions not found. See [PrimeReact accordiontab documentation](https://primereact.org/accordiontab/) for complete API.*

---

## CPTAutoComplete

**PrimeReact Component:** `autocomplete`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `autoHighlight` | `boolean | undefined` | false | When enabled, highlights the first item in the list by default. |
| `delay` | `number | undefined` | 300 | Delay between keystrokes to wait before sending a query. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `dropdown` | `boolean | undefined` | false | Displays a button next to the input field when enabled. |
| `dropdownAriaLabel` | `string | undefined` | Choose | ARIA label for the dropdown button. Defaults to placeholder then Locale "choose" label. |
| `dropdownAutoFocus` | `boolean | undefined` | true | Focus the input field when the dropdown button is clicked if enabled. |
| `dropdownIcon` | `IconType<AutoCompleteProps<T>> | undefined` | - | Icon of the dropdown. |
| `dropdownMode` | `'blank' | 'current' | undefined` | blank | Specifies the behavior dropdown button. Default "blank" mode sends an empty string and "current" ... |
| `emptyMessage` | `string | undefined` | No results found. | Text to display when there is no data. Defaults to global value in i18n translation configuration. |
| `field` | `string | undefined` | - | Field of a suggested object to resolve and display. |
| `forceSelection` | `boolean | undefined` | false | When present, autocomplete clears the manual input if it does not match of the suggestions to for... |
| `inputClassName` | `string | undefined` | - | Style class of the input field. |
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputStyle` | `React.CSSProperties | undefined` | - | Inline style of the input field. |
| `loadingIcon` | `IconType<AutoCompleteProps> | undefined` | - | Icon of the loader. |
| `itemTemplate` | `React.ReactNode | ((suggestion: T, index: number) => Reac...` | - | Template of a list item. |
| `maxLength` | `number | undefined` | - | Maximum number of characters to initiate a search. |
| `minLength` | `number | undefined` | 1 | Minimum number of characters to initiate a search. |
| `multiple` | `M` | false | Specifies if multiple values can be selected. |
| `selectionLimit` | `number | undefined` | - | Number of maximum options that can be selected. |
| `name` | `string | undefined` | - | Name of the input element. |
| `optionGroupChildren` | `string | undefined` | - | Property name or getter function that refers to the children options of option group. |
| `optionGroupLabel` | `string | undefined` | - | Property name or getter function to use as the label of an option group. |
| `optionGroupTemplate` | `React.ReactNode | ((suggestion: T, index: number) => Reac...` | - | Template of an option group item. |
| `panelClassName` | `string | undefined` | - | Style class of the overlay panel element. |

*... and 25 more props. See [PrimeReact autocomplete documentation](https://primereact.org/autocomplete/) for complete API.*

---

## CPTAvatar

**PrimeReact Component:** `avatar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `IconType<AvatarProps> | undefined` | - | Defines the icon to display. |
| `image` | `string | undefined` | - | Defines the image to display. |
| `imageAlt` | `string | undefined` | avatar | It specifies an alternate text for an image, if the image cannot be displayed. |
| `imageFallback` | `'default' | string | undefined` | default | Defines a fallback image or URL if the main image fails to load. If "default" will fallback to la... |
| `label` | `string | undefined` | - | Defines the text to display. |
| `shape` | `'square' | 'circle' | undefined` | square | Shape of the element. |
| `size` | `'normal' | 'large' | 'xlarge' | undefined` | normal | Size of the element. |
| `template` | `React.ReactNode | ((props: AvatarProps) => React.ReactNode)` | - | Template of the content. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact avatar documentation](https://primereact.org/avatar/) for complete API.*

---

## CPTAvatarGroup

**PrimeReact Component:** `avatargroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact avatargroup documentation](https://primereact.org/avatargroup/) for complete API.*

---

## CPTBlockUI

**PrimeReact Component:** `blockui`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoZIndex` | `boolean | undefined` | true | Whether to automatically manage layering. |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `blocked` | `boolean | undefined` | false | Controls the blocked state. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `containerClassName` | `string | undefined` | - | Style class of the container element. |
| `containerStyle` | `React.CSSProperties | undefined` | - | Inline style of the container element. |
| `fullScreen` | `boolean | undefined` | false | When enabled, the whole document gets blocked. |
| `template` | `React.ReactNode | ((props: BlockUIProps) => React.ReactNo...` | - | Template of mask. |

*... and 3 more props. See [PrimeReact blockui documentation](https://primereact.org/blockui/) for complete API.*

---

## CPTBreadcrumb

**PrimeReact Component:** `breadcrumb`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `home` | `MenuItem | undefined` | - | MenuItem configuration for the home icon. |
| `separatorIcon` | `IconType<BreadCrumbProps> | undefined` | - | Icon of the separator. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact breadcrumb documentation](https://primereact.org/breadcrumb/) for complete API.*

---

## CPTButton

**PrimeReact Component:** `button`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badge` | `string | undefined` | - | Value of the badge. |
| `badgeClassName` | `string | undefined` | - | Style class of the badge. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `icon` | `IconType<ButtonProps> | undefined` | - | Name of the icon or JSX.Element for icon. |
| `text` | `boolean | undefined` | false | Add a textual class to the button without a background initially. |
| `rounded` | `boolean | undefined` | false | Add a circular border radius to the button. |
| `raised` | `boolean | undefined` | false | Add a shadow to indicate elevation. |
| `outlined` | `boolean | undefined` | false | Add a border class without a background initially. |
| `link` | `boolean | undefined` | false | Add a link style to the button. |
| `severity` | `'secondary' | 'success' | 'info' | 'warning' | 'danger' |...` | - | Defines the style of the button, valid values are "secondary", "success", "info", "warning", "dan... |
| `size` | `'small' | 'large' | undefined` | - | Defines the size of the button, valid values are "small" and "large". |
| `iconPos` | `'top' | 'bottom' | 'left' | 'right' | undefined` | left | Position of the icon, valid values are "left", "right", "top" and "bottom". |
| `label` | `string | undefined` | - | Text of the button. |
| `loading` | `boolean | undefined` | false | Display loading icon of the button |
| `loadingIcon` | `IconType<ButtonProps> | undefined` | - | Name of the loading icon or JSX.Element for loading icon. |
| `plain` | `boolean | undefined` | false | Add a plain textual class to the button without a background initially. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `visible` | `boolean | undefined` | true | When present, it specifies that the element should be visible. |

*... and 3 more props. See [PrimeReact button documentation](https://primereact.org/button/) for complete API.*

---

## CPTButtonGroup

**PrimeReact Component:** `buttongroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `pt` | `ButtonGroupPassThroughOptions` | - | Used to pass attributes to DOM elements inside the component. |
| `ptOptions` | `PassThroughOptions` | - | Used to configure passthrough(pt) options of the component. |
| `unstyled` | `boolean` | false | When enabled, it removes component related styles in the core. |

---

## CPTCalendar

**PrimeReact Component:** `calendar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `selectionMode` | `TMode` | single | Specifies the selection mode either "single", "range", or "multiple"; |
| `value` | `Nullable<TValue>` | null | Value of the component. |

---

## CPTCard

**PrimeReact Component:** `card`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `React.ReactNode | ((props: CardProps) => React.ReactNode)` | - | Header of the card. |
| `footer` | `React.ReactNode | ((props: CardProps) => React.ReactNode)` | - | Footer of the card. |
| `title` | `React.ReactNode | ((props: CardProps) => React.ReactNode)` | - | Title of the card. |
| `subTitle` | `React.ReactNode | ((props: CardProps) => React.ReactNode)` | - | Secondary title of the card. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact card documentation](https://primereact.org/card/) for complete API.*

---

## CPTCarousel

**PrimeReact Component:** `carousel`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any[]` | - | An array of objects to display. |
| `page` | `number | undefined` | - | Index of the first item. |
| `header` | `React.ReactNode | undefined` | - | Label of header. |
| `footer` | `React.ReactNode | undefined` | - | Label of footer. |
| `circular` | `boolean | undefined` | false | Defines if scrolling would be infinite. |
| `showIndicators` | `boolean | undefined` | true | Whether to display indicator container. |
| `showNavigators` | `boolean | undefined` | true | Whether to display navigation buttons in container. |
| `autoplayInterval` | `number | undefined` | - | Time in milliseconds to scroll items automatically. |
| `numVisible` | `number | undefined` | 1 | Number of items per page. |
| `numScroll` | `number | undefined` | 1 | Number of items to scroll. |
| `prevIcon` | `IconType<CarouselProps> | undefined` | - | Icon for the previous button by orientation. |
| `nextIcon` | `IconType<CarouselProps> | undefined` | - | Icon for the next button by orientation. |
| `responsiveOptions` | `CarouselResponsiveOption[] | undefined` | - | An array of options for responsive design. |
| `orientation` | `'vertical' | 'horizontal' | undefined` | horizontal | Specifies the layout of the component, valid values are "horizontal" and "vertical". |
| `verticalViewPortHeight` | `string | undefined` | 300px | Height of the viewport in vertical layout. |
| `contentClassName` | `string | undefined` | - | Style class of main content. |
| `containerClassName` | `string | undefined` | - | Style class of the viewport container. |
| `indicatorsContentClassName` | `string | undefined` | - | Style class of the paginator items. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact carousel documentation](https://primereact.org/carousel/) for complete API.*

---

## CPTChart

**PrimeReact Component:** `chart`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `type` | `string | undefined` | - | Type of the chart. |
| `data` | `object | undefined` | - | Data to display. |
| `options` | `object | undefined` | - | Options to customize the chart. |
| `plugins` | `any[] | undefined` | - | Used to custom plugins of the chart. |
| `width` | `string | undefined` | - | Width of the chart in non-responsive mode. |
| `height` | `string | undefined` | - | Height of the chart in non-responsive mode. |
| `ariaLabel` | `string | undefined` | - | ARIA label for the chart canvas. Defaults to options.plugins.title.text if available. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact chart documentation](https://primereact.org/chart/) for complete API.*

---

## CPTCheckbox

**PrimeReact Component:** `checkbox`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `value` | `any` | - | Value of the component. |
| `name` | `string | undefined` | - | Name of the checkbox element . |
| `checked` | `boolean` | false | Specifies whether a checkbox should be checked or not. |
| `trueValue` | `any` | true | Value in checked state. |
| `falseValue` | `any` | false | Value in unchecked state. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element value cannot be altered. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `required` | `boolean | undefined` | false | When present, it specifies that an input field must be filled out before submitting the form. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that the value cannot be changed. |
| `tabIndex` | `number | undefined` | false | Index of the element in tabbing order. |
| `icon` | `IconType<CheckboxProps> | undefined` | - | Icon to display in checkbox. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 6 more props. See [PrimeReact checkbox documentation](https://primereact.org/checkbox/) for complete API.*

---

## CPTChip

**PrimeReact Component:** `chip`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | - | Defines the text to display. |
| `icon` | `IconType<ChipProps> | undefined` | - | Defines the icon to display. |
| `image` | `string | undefined` | - | Defines the image to display. |
| `removable` | `boolean | undefined` | false | Whether to display a remove icon. |
| `removeIcon` | `IconType<ChipProps> | undefined` | - | Icon of the remove element. |
| `template` | `TemplateType<ChipProps> | undefined` | - | Template of an item. |
| `imageAlt` | `string | undefined` | - | It specifies an alternate text for an image, if the image cannot be displayed. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact chip documentation](https://primereact.org/chip/) for complete API.*

---

## CPTChips

**PrimeReact Component:** `chips`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `name` | `string | undefined` | - | Name of the input field. |
| `placeholder` | `string | undefined` | - | Advisory information to display on input. |
| `value` | `string[] | undefined` | - | Value of the component. |
| `max` | `number | undefined` | - | Maximum number of entries allowed. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that the element should be read-only. |
| `removable` | `boolean | ((options: ChipsRemovableOptions) => boolean)` | true | Whether an item is removable. |
| `removeIcon` | `IconType<ChipsProps> | undefined` | - | Icon of the remove element. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `separator` | `string | undefined` | - | Separator char to add an item when pressed in addition to the enter key. |
| `allowDuplicate` | `boolean` | true | Whether to allow duplicate values or not. |
| `keyfilter` | `KeyFilterType | undefined` | - | Format definition of the keys to block. |
| `addOnBlur` | `boolean | undefined` | false | Whether to add an item when the input loses focus. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact chips documentation](https://primereact.org/chips/) for complete API.*

---

## CPTColorPicker

**PrimeReact Component:** `colorpicker`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `defaultColor` | `string | undefined` | ff0000 | Default color to display when value is null. |
| `format` | `'hex' | 'rgb' | 'hsb' | undefined` | hex | Format to use in value binding. |
| `inline` | `boolean | undefined` | false | Whether to display as an overlay or not. |
| `inputId` | `string | undefined` | - | Identifier of the focus input to match a label defined for the dropdown. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputStyle` | `React.CSSProperties | undefined` | - | Inline style of the input field. |
| `inputClassName` | `string | undefined` | - | Inline style of the input field. |
| `panelClassName` | `string | undefined` | - | Style class of the overlay panel. |
| `panelStyle` | `React.CSSProperties | undefined` | - | Inline style of the overlay panel. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `value` | `string | ColorPickerRGBType | ColorPickerHSBType | undefined` | - | Value of the component. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact colorpicker documentation](https://primereact.org/colorpicker/) for complete API.*

---

## CPTColumn

**PrimeReact Component:** `column`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'left' | 'right' | 'center' | undefined | null` | - | Aligns the content of the column, valid values are left, right and center. |
| `alignFrozen` | `'left' | 'right' | undefined` | - | Position of a frozen column, valid values are left and right. |
| `alignHeader` | `'left' | 'right' | 'center' | undefined | null` | - | Aligns the header of the column, valid values are left, right and center. |
| `body` | `React.ReactNode | ((data: any, options: ColumnBodyOptions...` | - | Body content of the column. |
| `bodyClassName` | `string | ((data: any, options: ColumnBodyOptions) => string)` | - | Style class of the body. If using a function must return a string. |
| `bodyStyle` | `React.CSSProperties | undefined` | - | Inline style of the body. |
| `cellEditValidateOnClose` | `boolean | undefined` | false | When enabled and cellEditorValidator is set, force to call cellEditorValidator before cell editor... |
| `cellEditValidatorEvent` | `string | undefined` | click | Event to trigger the validation, possible values are "click" and "blur". |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `colSpan` | `number | undefined` | - | Number of columns to span for grouping. |
| `columnKey` | `string | undefined` | - | Identifier of a column if field property is not defined. Only utilized by reorderableColumns feat... |
| `dataType` | `'text' | 'numeric' | 'date' | string | undefined` | - | Depending on the dataType of the column, suitable match modes are displayed. |
| `editor` | `React.ReactNode | ((options: ColumnEditorOptions) => Reac...` | - | Function to provide the cell editor input. |
| `excludeGlobalFilter` | `boolean | undefined` | false | Whether to exclude from global filtering or not. |
| `expander` | `boolean | ((data: any, options: ColumnBodyOptions) => boo...` | false | Displays an icon to toggle row expansion. |
| `exportable` | `boolean | undefined` | true | Defines whether the column is exported or not. |
| `exportField` | `string | undefined` | - | Property of a row data used for exporting, defaults to field. |
| `exportHeader` | `string | undefined` | - | Custom export header of the column to be exported. |
| `field` | `string | undefined` | - | Property of a row data. |
| `filter` | `boolean | undefined` | false | Defines if a column can be filtered. |
| `filterApply` | `React.ReactNode | ((options: ColumnFilterApplyTemplateOpt...` | - | Template of apply element in menu. |
| `filterClear` | `React.ReactNode | ((options: ColumnFilterClearTemplateOpt...` | - | Template of clear element in menu. |
| `filterElement` | `React.ReactNode | ((options: ColumnFilterElementTemplateO...` | - | Element for custom filtering. |
| `filterField` | `string | undefined` | - | Property of a row data used for filtering, defaults to field. |
| `filterFooter` | `React.ReactNode | ((options: ColumnFilterFooterTemplateOp...` | - | Template of footer element in menu. |
| `filterHeader` | `React.ReactNode | ((options: ColumnFilterHeaderTemplateOp...` | - | Template of header element in menu. |
| `filterHeaderClassName` | `string | undefined` | - | Style class of the filter header. |
| `filterHeaderStyle` | `React.CSSProperties | undefined` | - | Inline style of the filter header. |
| `filterMatchMode` | `FilterMatchMode | string | undefined` | - | Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notI... |
| `filterMatchModeOptions` | `ColumnFilterMatchModeOptions[]` | - | An array of label-value pairs to override the global match mode options. |

*... and 38 more props. See [PrimeReact column documentation](https://primereact.org/column/) for complete API.*

---

## CPTColumnGroup

**PrimeReact Component:** `columngroup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact columngroup documentation](https://primereact.org/columngroup/) for complete API.*

---

## CPTConfirmDialog

**PrimeReact Component:** `confirmdialog`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `group` | `string | undefined` | - | Optional key to match the key of the confirmation, useful to target a specific confirm dialog ins... |
| `tagKey` | `string | undefined` | - | Unique tag key used to separate the confirmDialog components in the page. |
| `visible` | `boolean | undefined` | false | Specifies the visibility of the confirm dialog. |
| `message` | `React.ReactNode | ((options: ConfirmDialogOptions) => Rea...` | - | Message of the confirmation. |
| `rejectLabel` | `string | undefined` | No | Label of the reject button. |
| `acceptLabel` | `string | undefined` | Yes | Label of the accept button. |
| `icon` | `IconType<ConfirmDialogProps> | undefined` | - | Icon to display next to the message. |
| `rejectIcon` | `IconType<ConfirmDialogProps> | undefined` | - | Icon of the reject button. |
| `acceptIcon` | `IconType<ConfirmDialogProps> | undefined` | - | Icon of the accept button. |
| `rejectClassName` | `string | undefined` | - | Style class of the reject button. |
| `acceptClassName` | `string | undefined` | - | Style class of the accept button. |
| `defaultFocus` | `string | undefined` | accept | Element to receive the focus when the dialog gets visible, valid values are "accept" and "reject". |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `footer` | `React.ReactNode | ((options: ConfirmDialogOptions) => Rea...` | - | Footer content of the confirm dialog. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 4 more props. See [PrimeReact confirmdialog documentation](https://primereact.org/confirmdialog/) for complete API.*

---

## CPTConfirmPopup

**PrimeReact Component:** `confirmpopup`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tagKey` | `string | undefined` | - | Unique tag key used to separate the confirmPopup components in the page. |
| `target` | `HTMLElement | undefined` | - | Target element to align the popup. |
| `visible` | `boolean | undefined` | false | Specifies the visibility of the confirm popup. |
| `defaultFocus` | `string | undefined` | accept | Element to receive the focus when the dialog gets visible, valid values are "accept" and "reject". |
| `message` | `React.ReactNode | ((options: ConfirmPopupOptions) => Reac...` | - | Message of the confirmation. |
| `rejectLabel` | `string | undefined` | No | Label of the reject button. |
| `acceptLabel` | `string | undefined` | Yes | Label of the accept button. |
| `icon` | `IconType<ConfirmPopupProps> | undefined` | - | Icon to display next to the message. |
| `rejectIcon` | `IconType<ConfirmPopupProps> | undefined` | - | Icon of the reject button. |
| `acceptIcon` | `IconType<ConfirmPopupProps> | undefined` | - | Icon of the accept button. |
| `rejectClassName` | `string | undefined` | - | Style class of the reject button. |
| `acceptClassName` | `string | undefined` | - | Style class of the accept button. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `dismissable` | `boolean | undefined` | true | Enables to hide the popup when outside is clicked. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the popup. |
| `footer` | `React.ReactNode | ((options: ConfirmPopupOptions) => Reac...` | - | Footer content of the confirm popup. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `content` | `React.ReactNode | ((props: ContentProps) => React.ReactNode)` | - | Specifies a custom content for the dialog. For more complex markup, use the "content" slot instead. |

*... and 5 more props. See [PrimeReact confirmpopup documentation](https://primereact.org/confirmpopup/) for complete API.*

---

## CPTContextMenu

**PrimeReact Component:** `contextmenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `global` | `boolean | undefined` | false | Attaches the menu to document instead of a particular item. |
| `autoZIndex` | `boolean | undefined` | true | Whether to automatically manage layering. |
| `ariaLabel` | `string | undefined` | - | Used to define a string that labels the component. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `breakpoint` | `string | undefined` | - | The breakpoint to define the maximum width boundary when responsiveness is enabled. |
| `scrollHeight` | `string | undefined` | 400px | Maximum height of the options panel on responsive mode. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `submenuIcon` | `IconType<ContextMenuProps> | undefined` | - | Icon of the submenu. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 2 more props. See [PrimeReact contextmenu documentation](https://primereact.org/contextmenu/) for complete API.*

---

## CPTDataTable

**PrimeReact Component:** `datatable`

*Props information not available. See [PrimeReact datatable documentation](https://primereact.org/datatable/) for complete API.*

---

## CPTDataView

**PrimeReact Component:** `dataview`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'list' | 'grid' | (string & Record<string, unknown>)` | - | Orientation of the panels, valid values are "list" and "grid". |
| `listIcon` | `IconType<DataViewProps> | undefined` | - | Defines the display mode list icon. |
| `gridIcon` | `IconType<DataViewProps> | undefined` | - | Defines the display mode grid icon. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact dataview documentation](https://primereact.org/dataview/) for complete API.*

---

## CPTDataViewLayoutOptions

**PrimeReact Component:** `dataviewlayoutoptions`

*Type definitions not found. See [PrimeReact dataviewlayoutoptions documentation](https://primereact.org/dataviewlayoutoptions/) for complete API.*

---

## CPTDialog

**PrimeReact Component:** `dialog`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `ariaCloseIconLabel` | `string | undefined` | - | Defines a string that labels the close icon. |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `blockScroll` | `boolean | undefined` | false | Whether background scroll should be blocked when dialog is visible. |
| `breakpoints` | `DialogBreakpoints | undefined` | - | Object literal to define widths per screen size. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `closable` | `boolean | undefined` | true | When enabled, the dialog can be closed by clicking the close icon, pressing escape key or clickin... |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the dialog. |
| `contentClassName` | `string | undefined` | - | Style class of the content section. |
| `contentStyle` | `React.CSSProperties | undefined` | - | Style of the content section. |
| `dismissableMask` | `boolean | undefined` | false | Specifies if clicking the modal background should hide the dialog. |
| `draggable` | `boolean | undefined` | true | Enables dragging to change the position using header. |
| `focusOnShow` | `boolean | undefined` | true | When enabled, first button receives focus on show. |
| `footer` | `React.ReactNode | ((props: DialogProps) => React.ReactNode)` | - | Footer content of the dialog. |
| `header` | `React.ReactNode | ((props: DialogProps) => React.ReactNode)` | - | Title content of the dialog. |
| `headerClassName` | `string | undefined` | - | Style class of the header section. |
| `closeIcon` | `IconType<DialogProps> | undefined` | - | Icon to display in the dialog close button. |
| `headerStyle` | `React.CSSProperties | undefined` | - | Style of the header section. |
| `icons` | `React.ReactNode | ((props: DialogProps) => React.ReactNode)` | - | Custom icons template for the header. |
| `keepInViewport` | `boolean | undefined` | true | Keeps dialog in the viewport. |
| `maskClassName` | `string | undefined` | - | Style class of the mask. |
| `maskStyle` | `React.CSSProperties | undefined` | - | Inline style of the mask. |
| `maximizable` | `boolean | undefined` | false | Whether the dialog can be displayed full screen. |
| `maximized` | `boolean | undefined` | false | When enabled, the dialog is initially displayed full screen. |
| `minX` | `number | undefined` | 0 | Minimum value for the left coordinate of dialog in dragging. |
| `minY` | `number | undefined` | 0 | Minimum value for the top coordinate of dialog in dragging. |
| `modal` | `boolean | undefined` | true | Defines if background should be blocked when dialog is displayed. |
| `position` | `'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-lef...` | center | Position of the dialog, options are "center", "top", "bottom", "left", "right", "top-left", "top-... |
| `resizable` | `boolean | undefined` | true | Enables resizing of the content. |
| `rtl` | `boolean | undefined` | false | When enabled dialog is displayed in RTL direction. |

*... and 13 more props. See [PrimeReact dialog documentation](https://primereact.org/dialog/) for complete API.*

---

## CPTDivider

**PrimeReact Component:** `divider`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'center' | 'left' | 'right' | 'bottom' | 'top' | undefined` | - | Alignment of the content, options are "left", "center", "right" for horizontal layout and "top", ... |
| `layout` | `'vertical' | 'horizontal' | undefined` | horizontal | Specifies the orientation, valid values are "horizontal" and "vertical". |
| `type` | `'solid' | 'dashed' | 'dotted' | undefined` | solid | Border style type, default is "solid" and other options are "dashed" and "dotted". |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact divider documentation](https://primereact.org/divider/) for complete API.*

---

## CPTDock

**PrimeReact Component:** `dock`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | MenuModel instance to define the action items. |
| `position` | `'top' | 'bottom' | 'left' | 'right' | undefined` | bottom | Position of element. Valid values are 'bottom', 'top', 'left' and 'right'. |
| `magnification` | `boolean | undefined` | - | Whether to allow scale animation. |
| `header` | `React.ReactNode | ((options: DockHeaderTemplateOptions) =...` | - | Template of header element. |
| `footer` | `React.ReactNode | ((options: DockFooterTemplateOptions) =...` | - | Template of footer element. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `tabIndex` | `number | undefined` | - | Index of the element in tabbing order. |

*... and 3 more props. See [PrimeReact dock documentation](https://primereact.org/dock/) for complete API.*

---

## CPTDropdown

**PrimeReact Component:** `dropdown`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `ariaLabel` | `string | undefined` | - | Used to define a string that labels the component. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `autoFocus` | `boolean` | false | When present, it specifies that the component should automatically get focus on load. |
| `clearIcon` | `IconType<DropdownProps> | undefined` | - | Icon of the dropdown. |
| `dataKey` | `string | undefined` | - | A property to uniquely match the value in options for better performance. |
| `invalid` | `boolean` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean` | false | When present, it specifies that the component should be disabled. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `dropdownIcon` | `IconType<DropdownProps> | undefined` | - | Icon of the dropdown. |
| `collapseIcon` | `IconType<DropdownProps> | undefined` | - | Icon of collapse action. |
| `editable` | `boolean` | false | When present, custom value instead of predefined options can be entered using the editable input ... |
| `highlightOnSelect` | `boolean` | true | Whether the selected option will be add highlight class. |
| `checkmark` | `boolean` | false | Whether the selected option will be shown with a check mark. |
| `emptyFilterMessage` | `React.ReactNode | ((props: DropdownProps) => React.ReactN...` | No results found | Template to display when filtering does not return any results. |
| `emptyMessage` | `React.ReactNode | ((props: DropdownProps) => React.ReactN...` | No available options | Text to display when there are no options available. |
| `filter` | `boolean` | false | When specified, displays an input field to filter the items on keyup. |
| `filterIcon` | `IconType<DropdownProps> | undefined` | - | Icon of the filter to search. |
| `filterBy` | `'label' | string | undefined` | label | When filtering is enabled, filterBy decides which field or fields (comma separated) to search aga... |
| `filterClearIcon` | `IconType<DropdownProps> | undefined` | - | Icon of the filter to clear. |
| `filterDelay` | `number | undefined` | 300 | Delay in milliseconds before filtering the data. |
| `filterInputAutoFocus` | `boolean` | false | When the panel is opened, it specifies that the filter input should focus automatically. |
| `filterLocale` | `string | undefined` | - | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterMatchMode` | `'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notE...` | contains | Defines how the items are filtered, valid values are "contains", (default) "startsWith", "endsWit... |
| `filterPlaceholder` | `string | undefined` | - | Placeholder text to show when filter input is empty. |
| `filterTemplate` | `React.ReactNode | ((options: { filterOptions: DropdownFil...` | - | The template of filter element. |
| `focusInputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the focusable input element. |
| `selectOnFocus` | `boolean` | false | When enabled, the focused tab is activated. |
| `focusOnHover` | `boolean` | true | When enabled, the focus is placed on the hovered option. |
| `autoOptionFocus` | `boolean` | false | Whether to focus on the first visible or selected element. |

*... and 39 more props. See [PrimeReact dropdown documentation](https://primereact.org/dropdown/) for complete API.*

---

## CPTEditor

**PrimeReact Component:** `editor`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string | undefined` | - | Value of the content. |
| `placeholder` | `string | undefined` | - | Placeholder text to show when editor is empty. |
| `readOnly` | `boolean | undefined` | false | Whether to instantiate the editor to read-only mode. |
| `modules` | `any` | - | Modules configuration, see [here](https://quilljs.com/docs/modules/) for available options. |
| `formats` | `string[] | undefined` | - | Whitelist of formats to display, see [here](https://quilljs.com/docs/formats/) for available opti... |
| `theme` | `string | undefined` | - | The theme of editor |
| `showHeader` | `boolean | undefined` | false | Whether to show the header of editor. |
| `headerTemplate` | `React.ReactNode | undefined` | - | Style and modules of the toolbar. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact editor documentation](https://primereact.org/editor/) for complete API.*

---

## CPTFieldset

**PrimeReact Component:** `fieldset`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `legend` | `React.ReactNode | undefined` | - | Header text of the fieldset. |
| `toggleable` | `boolean | undefined` | false | When specified, content can toggled by clicking the legend. |
| `collapsed` | `boolean | undefined` | false | Defines the default visibility state of the content. |
| `collapseIcon` | `IconType<FieldsetProps> | undefined` | - | Icon of an expanded tab. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `expandIcon` | `IconType<FieldsetProps> | undefined` | - | Icon of an collapsed tab. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact fieldset documentation](https://primereact.org/fieldset/) for complete API.*

---

## CPTFileUpload

**PrimeReact Component:** `fileupload`

*Props information not available. See [PrimeReact fileupload documentation](https://primereact.org/fileupload/) for complete API.*

---

## CPTGalleria

**PrimeReact Component:** `galleria`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any[] | undefined` | - | An array of objects to display. |
| `activeIndex` | `number | undefined` | 0 | Index of the first item. |
| `fullScreen` | `boolean | undefined` | false | Whether to display the component on fullscreen. |
| `closeIcon` | `IconType<GalleriaProps> | undefined` | - | Icon to display in the galleria close button. |
| `header` | `React.ReactNode | undefined` | - | Custom header template. |
| `footer` | `React.ReactNode | undefined` | - | Custom footer template. |
| `numVisible` | `number | undefined` | 3 | Number of items per page. |
| `responsiveOptions` | `GalleriaResponsiveOptions[] | undefined` | - | An array of options for responsive design. |
| `showItemNavigators` | `boolean | undefined` | false | Whether to display navigation buttons in item container. |
| `showThumbnailNavigators` | `boolean | undefined` | true | Whether to display navigation buttons in thumbnail container. |
| `showItemNavigatorsOnHover` | `boolean | undefined` | false | Whether to display navigation buttons on item container's hover. |
| `changeItemOnIndicatorHover` | `boolean | undefined` | false | When enabled, item is changed on indicator item's hover. |
| `circular` | `boolean | undefined` | false | Defines if scrolling would be infinite. |
| `autoPlay` | `boolean | undefined` | false | Items are displayed with a slideshow in autoPlay mode. |
| `transitionInterval` | `number | undefined` | 4000 | Time in milliseconds to scroll items. |
| `showThumbnails` | `boolean | undefined` | true | Whether to display thumbnail container. |
| `itemNextIcon` | `IconType<GalleriaProps> | undefined` | - | Icon to show in the next item button. |
| `itemPrevIcon` | `IconType<GalleriaProps> | undefined` | - | Icon to show in the previous item button. |
| `nextThumbnailIcon` | `IconType<GalleriaProps> | undefined` | - | Icon to show in the next thumbnail button. |
| `prevThumbnailIcon` | `IconType<GalleriaProps> | undefined` | - | Icon to show in the previous thumbnail button. |
| `thumbnailsPosition` | `'top' | 'bottom' | 'left' | 'right' | undefined` | bottom | Position of thumbnails. Valid values are "bottom", "top", "left" and "right". |
| `showIndicators` | `boolean | undefined` | false | Whether to display indicator container. |
| `showIndicatorsOnItem` | `boolean | undefined` | false | When enabled, indicator container is displayed on item container. |
| `indicatorsPosition` | `'top' | 'bottom' | 'left' | 'right' | undefined` | bottom | Position of indicators. Valid values are "bottom", "top", "left" and "right". |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact galleria documentation](https://primereact.org/galleria/) for complete API.*

---

## CPTImage

**PrimeReact Component:** `image`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alt` | `string | undefined` | - | Specifies an alternate text for an area, if the image cannot be displayed. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the preview. |
| `crossOrigin` | `'anonymous' | 'use-credentials' | '' | undefined` | - | The crossorigin content attribute on media elements is a CORS settings attribute. |
| `downloadable` | `boolean | undefined` | - | Adds a download button to the preview control menu. |
| `downloadIcon` | `IconType<ImageProps> | undefined` | - | Icon of the download button. |
| `loading` | `'eager' | 'lazy' | undefined` | - | Specifies whether a browser should load an image immediately or to defer loading of off-screen im... |
| `rotateRightIcon` | `IconType<ImageProps> | undefined` | - | Icon of the rotate right button. |
| `rotateLeftIcon` | `IconType<ImageProps> | undefined` | - | Icon of the rotate left button. |
| `referrerPolicy` | `React.HTMLAttributeReferrerPolicy | undefined` | - | HTTP header controls how much referrer information (sent with the Referer header) should be inclu... |
| `useMap` | `string | undefined` | - | Specifies an image as a client-side image map (an image map is an image with clickable areas) |
| `zoomOutIcon` | `IconType<ImageProps> | undefined` | - | Icon of the zoom out button. |
| `zoomInIcon` | `IconType<ImageProps> | undefined` | - | Icon of the zoom in button. |
| `closeIcon` | `IconType<ImageProps> | undefined` | - | Icon of the close button. |
| `height` | `string | undefined` | - | Height of the image element. |
| `imageClassName` | `string | undefined` | - | Style class of the image element. |
| `imageStyle` | `React.CSSProperties | undefined` | - | Inline style of the image element. |
| `preview` | `boolean | undefined` | - | Controls the preview functionality. |
| `indicatorIcon` | `IconType<ImageProps> | undefined` | - | Changing the default icon when the image is hovered in preview mode. |
| `src` | `string | undefined` | - | Specifies the path to the image. |
| `template` | `any | undefined` | - | Changing the default icon when the image is hovered in preview mode. Since v9, use `indicatorIcon... |
| `width` | `string | undefined` | - | Width of the image element. |
| `zoomSrc` | `string | undefined` | - | Zoomed image that may be different than "src" image. |

*... and 3 more props. See [PrimeReact image documentation](https://primereact.org/image/) for complete API.*

---

## CPTInplace

**PrimeReact Component:** `inplace`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `active` | `boolean | undefined` | false | Whether the content is displayed or not. To use in controlled mode you must implement `onToggle` ... |
| `closable` | `boolean | undefined` | false | Displays a button to switch back to display mode. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `ariaLabel` | `string | undefined` | - | Used to define a string that labels the component. |
| `closeIcon` | `IconType<InplaceProps> | undefined` | - | Icon of the close button. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact inplace documentation](https://primereact.org/inplace/) for complete API.*

---

## CPTInplaceContent

**PrimeReact Component:** `inplacecontent`

*Type definitions not found. See [PrimeReact inplacecontent documentation](https://primereact.org/inplacecontent/) for complete API.*

---

## CPTInplaceDisplay

**PrimeReact Component:** `inplacedisplay`

*Type definitions not found. See [PrimeReact inplacedisplay documentation](https://primereact.org/inplacedisplay/) for complete API.*

---

## CPTInputMask

**PrimeReact Component:** `inputmask`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `mask` | `string | undefined` | - | Mask pattern. |
| `slotChar` | `string | undefined` | _ | Placeholder character in mask. |
| `autoClear` | `boolean | undefined` | true | Clears the incomplete value on blur. |
| `unmask` | `boolean | undefined` | false | Defines if model sets the raw unmasked value to bound value or the formatted mask value. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element value cannot be altered. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that an input field is read-only. |
| `required` | `boolean | undefined` | false | When present, it specifies that the element must be filled out before submitting the form. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact inputmask documentation](https://primereact.org/inputmask/) for complete API.*

---

## CPTInputNumber

**PrimeReact Component:** `inputnumber`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number | null` | - | Value of the component. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `format` | `boolean | undefined` | true | Whether to format the value. |
| `showButtons` | `boolean | undefined` | false | Displays spinner buttons. |
| `buttonLayout` | `'stacked' | 'horizontal' | 'vertical' | undefined` | stacked | Layout of the buttons. |
| `incrementButtonClassName` | `string | undefined` | - | Style class of the increment button. |
| `decrementButtonClassName` | `string | undefined` | - | Style class of the decrement button. |
| `incrementButtonIcon` | `IconType<InputNumberProps> | undefined` | - | Style class of the increment button. |
| `decrementButtonIcon` | `IconType<InputNumberProps> | undefined` | - | Style class of the decrement button. |
| `locale` | `string | undefined` | - | Locale to be used in formatting. |
| `localeMatcher` | `'lookup' | 'best fit' | string | undefined` | best fit | The locale matching algorithm to use. See [Locale Negotation](https://developer.mozilla.org/en-US... |
| `mode` | `'decimal' | 'currency' | undefined` | decimal | Defines the behavior of the component. |
| `suffix` | `string | undefined` | - | Text to display after the value. |
| `prefix` | `string | undefined` | - | Text to display before the value. |
| `currency` | `string | undefined` | - | The currency to use in currency formatting. Possible values are the [ISO 4217 currency codes](htt... |
| `currencyDisplay` | `string | undefined` | symbol | How to display the currency in currency formatting. Possible values are "symbol" to use a localiz... |
| `useGrouping` | `boolean | undefined` | true | Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. |
| `minFractionDigits` | `number | undefined` | - | The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for p... |
| `maxFractionDigits` | `number | undefined` | - | The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for p... |
| `roundingMode` | `RoundingMode` | halfExpand | How decimals should be rounded. [further information](https://developer.mozilla.org/en-US/docs/We... |
| `name` | `string | undefined` | - | Name of the input element. |
| `type` | `string | undefined` | text | Type of the input element. |
| `allowEmpty` | `boolean | undefined` | true | Determines whether the input field is empty. |
| `step` | `number | undefined` | 1 | Step factor to increment/decrement the value. |
| `min` | `number | undefined` | - | Mininum boundary value. |
| `max` | `number | undefined` | - | Maximum boundary value. |
| `maxLength` | `number | undefined` | - | Maximum value length. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | - | When present, it specifies that the element should be disabled. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |

*... and 17 more props. See [PrimeReact inputnumber documentation](https://primereact.org/inputnumber/) for complete API.*

---

## CPTInputSwitch

**PrimeReact Component:** `inputswitch`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `name` | `string | undefined` | - | Name of the input element. |
| `tabIndex` | `number | undefined` | - | Index of the element in tabbing order. |
| `checked` | `boolean` | false | Specifies whether a inputswitch should be checked or not. |
| `trueValue` | `any` | true | Value in checked state. |
| `falseValue` | `any` | false | Value in unchecked state. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 6 more props. See [PrimeReact inputswitch documentation](https://primereact.org/inputswitch/) for complete API.*

---

## CPTInputText

**PrimeReact Component:** `inputtext`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `keyfilter` | `KeyFilterType` | - | Format definition of the keys to block. |
| `size` | `number | string | undefined` | - | Size of the input. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `validateOnly` | `boolean | undefined` | false | When enabled, instead of blocking keys, input is validated internally to test against the regular... |
| `value` | `string | null | undefined` | - | The value of component |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact inputtext documentation](https://primereact.org/inputtext/) for complete API.*

---

## CPTInputTextarea

**PrimeReact Component:** `inputtextarea`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoResize` | `boolean | undefined` | false | When present, height of textarea changes as being typed. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `keyfilter` | `KeyFilterType` | - | Format definition of the keys to block. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `value` | `string | undefined` | - | The value of component |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact inputtextarea documentation](https://primereact.org/inputtextarea/) for complete API.*

---

## CPTKnob

**PrimeReact Component:** `knob`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number | undefined` | - | Value of the component. |
| `size` | `number | undefined` | 100 | Size of the component in pixels. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that the component value cannot be edited. |
| `showValue` | `boolean | undefined` | true | Whether the show the value inside the knob. |
| `step` | `number | undefined` | 1 | Step factor to increment/decrement the value. |
| `min` | `number | undefined` | 0 | Mininum boundary value. |
| `max` | `number | undefined` | 100 | Maximum boundary value. |
| `strokeWidth` | `number | undefined` | 14 | Width of the knob stroke. |
| `name` | `string | undefined` | - | Name of the input element. |
| `valueColor` | `string | undefined` | var(--primary-color, Black) | Background of the value. |
| `rangeColor` | `string | undefined` | var(--surface-border, LightGray) | Background color of the range. |
| `textColor` | `string | undefined` | var(--text-color-secondary, Black) | Color of the value text. |
| `valueTemplate` | `string | undefined` | &#123;value&#125; | Template string of the value. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 6 more props. See [PrimeReact knob documentation](https://primereact.org/knob/) for complete API.*

---

## CPTListbox

**PrimeReact Component:** `listbox`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `dataKey` | `string | undefined` | false | A property to uniquely match the value in options for better performance. |
| `disabled` | `boolean | undefined` | false | When specified, disables the component. |
| `emptyMessage` | `React.ReactNode | ((props: ListBoxProps) => React.ReactNode)` | - | Text to display when there is no data. |
| `emptyFilterMessage` | `React.ReactNode | ((props: ListBoxProps) => React.ReactNode)` | - | Template to display when filtering does not return any results. |
| `filter` | `boolean | undefined` | false | When specified, displays a filter input at header. |
| `filterBy` | `string | undefined` | label | When filtering is enabled, filterBy decides which field or fields (comma separated) to search aga... |
| `filterInputProps` | `any | undefined` | undefined | Props for the filter input, any prop is passed implicity to the filter input element. |
| `filterLocale` | `string | undefined` | undefined | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterMatchMode` | `'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notE...` | contains | Defines how the items are filtered, valid values are "contains", (default) "startsWith", "endsWit... |
| `filterPlaceholder` | `string | undefined` | - | Placeholder text to show when filter input is empty. |
| `filterTemplate` | `React.ReactNode | ((options: ListBoxFilterTemplateOptions...` | - | Custom template for the filter element. |
| `filterValue` | `string | undefined` | - | When specified, filter displays with this value. |
| `itemTemplate` | `React.ReactNode | ((option: any) => React.ReactNode)` | - | Custom template for the items. |
| `listClassName` | `string | undefined` | - | Inline style class of inner list element. |
| `listStyle` | `React.CSSProperties | undefined` | - | Inline style of inner list element. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `metaKeySelection` | `boolean | undefined` | true | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or un... |
| `multiple` | `boolean | undefined` | false | When specified, allows selecting multiple values. |
| `optionDisabled` | `string | ((option: any) => boolean) | undefined` | - | Property name or getter function to use as the disabled flag of an option, defaults to false when... |
| `optionGroupChildren` | `string | undefined` | - | Property name or getter function that refers to the children options of option group. |
| `optionGroupLabel` | `string | undefined` | - | Property name or getter function to use as the label of an option group. |
| `optionGroupTemplate` | `React.ReactNode | ((option: any, index: number) => React....` | - | Template of an option group item. |
| `optionLabel` | `string | undefined` | - | Name of the label field of an option when an arbitrary objects instead of SelectItems are used as... |
| `optionValue` | `string | undefined` | - | Name of the value field of an option when arbitrary objects are used as options instead of Select... |
| `options` | `SelectItemOptionsType | undefined` | - | An array of objects to display as the available options. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `value` | `any | undefined` | - | Selected value to display. |

*... and 7 more props. See [PrimeReact listbox documentation](https://primereact.org/listbox/) for complete API.*

---

## CPTMegaMenu

**PrimeReact Component:** `megamenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `orientation` | `'vertical' | 'horizontal' | undefined` | horizontal | Defines the orientation, valid values are horizontal and vertical. |
| `start` | `React.ReactNode | ((props: MegaMenuProps) => React.ReactN...` | - | The template of starting element. |
| `breakpoint` | `string | undefined` | - | The breakpoint to define the maximum width boundary when responsiveness is enabled. |
| `scrollHeight` | `string | undefined` | 400px | Maximum height of the options panel on responsive mode. |
| `submenuIcon` | `IconType<MegaMenuProps> | undefined` | - | Icon of the submenu. |
| `menuIcon` | `IconType<MegaMenuProps> | undefined` | - | Icon to display in the horizontal menu. |
| `tabIndex` | `number | undefined` | - | Index of the element in tabbing order. |
| `end` | `React.ReactNode | ((props: MegaMenuProps) => React.ReactN...` | - | The template of trailing element |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact megamenu documentation](https://primereact.org/megamenu/) for complete API.*

---

## CPTMenu

**PrimeReact Component:** `menu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `popup` | `boolean | undefined` | false | Defines if menu would displayed as a popup. |
| `popupAlignment` | `'left' | 'right'` | left | In popup mode determines how the overlay is aligned with its target. Values either 'left' or 'rig... |
| `autoZIndex` | `boolean | undefined` | true | Whether to automatically manage layering. |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `tabIndex` | `number | undefined` | - | Index of the element in tabbing order. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the Menu Popup. |

*... and 3 more props. See [PrimeReact menu documentation](https://primereact.org/menu/) for complete API.*

---

## CPTMenubar

**PrimeReact Component:** `menubar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `start` | `React.ReactNode | ((props: MenubarProps) => React.ReactNode)` | - | The template of starting element. |
| `submenuIcon` | `IconType<MenubarProps> | undefined` | - | Icon of the submenu. |
| `menuIcon` | `IconType<MenubarProps> | undefined` | - | Icon of the menu. |
| `ariaLabel` | `string | undefined` | - | Used to define a string that labels the component. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `end` | `React.ReactNode | ((props: MenubarProps) => React.ReactNode)` | - | The template of trailing element. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact menubar documentation](https://primereact.org/menubar/) for complete API.*

---

## CPTMessage

**PrimeReact Component:** `message`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `React.ReactNode | ((props: MessageProps) => React.ReactNode)` | - | Text of the message. |
| `severity` | `'success' | 'info' | 'warn' | 'error' | 'secondary' | 'co...` | - | Severity level of the message. |
| `content` | `React.ReactNode | ((props: MessageProps) => React.ReactNode)` | - | Custom template of the message. |
| `icon` | `IconType<MessageProps> | undefined` | based on severity | Icon for the message. If not set it will default to severity icon. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact message documentation](https://primereact.org/message/) for complete API.*

---

## CPTMeterGroup

**PrimeReact Component:** `metergroup`

*Props information not available. See [PrimeReact metergroup documentation](https://primereact.org/metergroup/) for complete API.*

---

## CPTMultiSelect

**PrimeReact Component:** `multiselect`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `checkboxIcon` | `IconType<MultiSelectProps> | undefined` | - | Icon of the checkbox when checked. |
| `closeIcon` | `IconType<MultiSelectProps> | undefined` | - | Close icon of the multiselect panel header. |
| `clearIcon` | `IconType<MultiSelectProps> | undefined` | - | Clear icon of the multiselect input. |
| `dataKey` | `string | undefined` | - | A property to uniquely match the value in options for better performance. |
| `disabled` | `boolean` | false | When present, it specifies that the component should be disabled. |
| `display` | `'comma' | 'chip' | undefined` | comma | Used mode to display the selected item. Valid values are 'comma' and 'chip'. |
| `dropdownIcon` | `IconType<MultiSelectProps> | undefined` | - | Icon class of the dropdown icon. |
| `emptyFilterMessage` | `React.ReactNode | ((props: MultiSelectProps) => React.Rea...` | No records found | Template to display when filtering does not return any results. |
| `emptyMessage` | `string` | - | Text to display when there are no options available. Defaults to global value in Locale configura... |
| `filter` | `boolean` | true | When specified, displays an input field to filter the items on keyup. |
| `filterBy` | `string | undefined` | label | When filtering is enabled, filterBy decides which field or fields (comma separated) to search aga... |
| `filterDelay` | `number | undefined` | 300 | Delay in milliseconds before filtering the data. |
| `filterInputAutoFocus` | `boolean` | true | When the panel is opened, it specifies that the filter input should focus automatically. |
| `filterIcon` | `IconType<MultiSelect> | undefined` | - | Icon of the filter icon. |
| `filterLocale` | `string | undefined` | undefined | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterMatchMode` | `'contains' | 'startsWith' | 'endsWith' | 'equals' | 'notE...` | contains | Defines how the items are filtered, valid values are "contains", (default) "startsWith", "endsWit... |
| `filterPlaceholder` | `string | undefined` | - | Placeholder text to show when filter input is empty. |
| `filterTemplate` | `React.ReactNode | ((options: MultiSelectTemplateOptions) ...` | - | The template of filter element. |
| `fixedPlaceholder` | `boolean` | false | Whether to display selected items in the label section or always display the placeholder as the d... |
| `flex` | `boolean` | false | Use flex layout for the items panel. |
| `inline` | `boolean` | false | Render the items panel inline. |
| `inputId` | `string | undefined` | - | Identifier of the focusable input. |
| `inputRef` | `React.Ref<HTMLSelectElement>` | - | Reference of the input element. |
| `itemClassName` | `string | undefined` | - | Style class of the items. |
| `itemCheckboxIcon` | `IconType<MultiSelect> | undefined` | - | The icon displayed in the header when all checkboxes are checked. |
| `itemTemplate` | `React.ReactNode | ((option: any) => React.ReactNode)` | - | Function that gets the option and returns the content for it. |
| `loading` | `boolean` | false | Displays a loader to indicate data load is in progress. |

*... and 44 more props. See [PrimeReact multiselect documentation](https://primereact.org/multiselect/) for complete API.*

---

## CPTOrganizationChart

**PrimeReact Component:** `organizationchart`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `OrganizationChartNodeData[] | undefined` | - | An array of nested TreeNodes. |
| `togglerIcon` | `IconType<OrganizationChartProps> | undefined` | - | Toggle icon of an expanded and collapsed node. |
| `selectionMode` | `'single' | 'multiple' | undefined` | - | Defines the selection mode, valid values "single" and "multiple". |
| `selection` | `OrganizationChartNodeData | OrganizationChartNodeData[] |...` | - | A single treenode instance or an array to refer to the selections. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact organizationchart documentation](https://primereact.org/organizationchart/) for complete API.*

---

## CPTOverlayPanel

**PrimeReact Component:** `overlaypanel`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `dismissable` | `boolean | undefined` | true | Enables to hide the overlay when outside is clicked. |
| `showCloseIcon` | `boolean | undefined` | false | When enabled, displays a close icon at top right corner. |
| `closeIcon` | `IconType<OverlayPanelProps> | undefined` | - | Icon to display as close icon. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the preview. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `ariaCloseLabel` | `string | undefined` | close | Aria label of the close icon. |
| `breakpoints` | `OverlayPanelBreakpoints | undefined` | - | Object literal to define widths per screen size. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact overlaypanel documentation](https://primereact.org/overlaypanel/) for complete API.*

---

## CPTPanel

**PrimeReact Component:** `panel`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `header` | `React.ReactNode | undefined` | - | Custom header template of the panel. |
| `footer` | `React.ReactNode | undefined` | - | Custom footer template of the panel. |
| `headerTemplate` | `React.ReactNode | ((options: PanelHeaderTemplateOptions) ...` | - | Header template of the panel to customize more. |
| `footerTemplate` | `React.ReactNode | ((options: PanelFooterTemplateOptions) ...` | - | Footer template of the panel to customize more. |
| `toggleable` | `boolean | undefined` | false | Defines if content of panel can be expanded and collapsed. |
| `collapsed` | `boolean | undefined` | false | Defines the initial state of panel content, supports one or two-way binding as well. |
| `expandIcon` | `IconType<PanelProps> | undefined` | - | Icon of a expanded tab. |
| `collapseIcon` | `IconType<PanelProps> | undefined` | - | Icon of a collapsed tab. |
| `icons` | `React.ReactNode | ((props: PanelProps) => React.ReactNode)` | - | Custom icons template for the header. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact panel documentation](https://primereact.org/panel/) for complete API.*

---

## CPTPanelMenu

**PrimeReact Component:** `panelmenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `expandedKeys` | `PanelMenuExpandedKeys` | - | A map of keys to represent the expansion state in controlled mode. |
| `multiple` | `boolean | undefined` | false | Whether multiple tabs can be activated at the same time or not. |
| `expandIcon` | `IconType<PanelMenuProps> | undefined` | - | Icon used when a submenu is collapsed. |
| `collapseIcon` | `IconType<PanelMenuProps> | undefined` | - | Icon used when a submenu is expanded. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact panelmenu documentation](https://primereact.org/panelmenu/) for complete API.*

---

## CPTPassword

**PrimeReact Component:** `password`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputStyle` | `React.CSSProperties | undefined` | - | Inline style of the input field. |
| `inputClassName` | `string | undefined` | - | Style class of the input field. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `hideIcon` | `IconType<PasswordProps> | undefined` | - | Hide icon template. |
| `showIcon` | `IconType<PasswordProps> | undefined` | - | Show icon template. |
| `promptLabel` | `string | undefined` | Please enter a password | Text to prompt password entry. |
| `weakLabel` | `string | undefined` | Weak | Text for a weak password. |
| `mediumLabel` | `string | undefined` | Medium | Text for a medium password. |
| `strongLabel` | `string | undefined` | Strong | Text for a strong password. |
| `mediumRegex` | `string | undefined` | ^(((?=. | Regex for a medium level password. |
| `strongRegex` | `string | undefined` | ^(?=. | Regex for a strong level password. |
| `feedback` | `boolean | undefined` | true | Whether to show the strength indicator or not. |
| `toggleMask` | `boolean | undefined` | false | Whether to show an icon to display the password as plain text. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `header` | `React.ReactNode | ((props: PasswordProps) => React.ReactN...` | - | Template of panel header if "feedback" is enabled. |
| `content` | `React.ReactNode | ((props: PasswordProps) => React.ReactN...` | - | Template of panel content if "feedback" is enabled. |
| `footer` | `React.ReactNode | ((props: PasswordProps) => React.ReactN...` | - | Template of panel footer if "feedback" is enabled. |
| `icon` | `React.ReactNode | ((event: PasswordIconEvent) => React.Re...` | - | Template of mask icon if "toggleMask" is enabled. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `keyfilter` | `KeyFilterType | undefined` | - | Format definition of the keys to block. |
| `panelStyle` | `React.CSSProperties | undefined` | - | Inline style of the overlay panel element. |
| `panelClassName` | `string | undefined` | - | Style class of the overlay panel element. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact password documentation](https://primereact.org/password/) for complete API.*

---

## CPTProgressBar

**PrimeReact Component:** `progressbar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string | number | null | undefined` | - | Current value of the progress. |
| `showValue` | `boolean | undefined` | true | Show or hide progress bar value. |
| `unit` | `string | undefined` | % | Unit sign appended to the value. |
| `mode` | `'determinate' | 'indeterminate' | undefined` | determinate | Defines the mode of the progress, valid values are "determinate" and "indeterminate". |
| `color` | `string | undefined` | - | Color for the background of the progress. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact progressbar documentation](https://primereact.org/progressbar/) for complete API.*

---

## CPTProgressSpinner

**PrimeReact Component:** `progressspinner`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `strokeWidth` | `string | undefined` | 2 | Width of the circle stroke. |
| `fill` | `string | undefined` | - | Color for the background of the circle. |
| `animationDuration` | `string | undefined` | 2s | Duration of the rotate animation. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact progressspinner documentation](https://primereact.org/progressspinner/) for complete API.*

---

## CPTRadioButton

**PrimeReact Component:** `radiobutton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `inputId` | `string | undefined` | - | Unique identifier of the inner native radiobutton. |
| `name` | `string | undefined` | - | Name of the checkbox element. |
| `value` | `any | undefined` | - | Value of the radio. |
| `checked` | `boolean | undefined` | false | Specifies whether a checkbox should be checked or not. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `readOnly` | `boolean | undefined` | - | When present, it specifies that an input field is read-only. |
| `required` | `boolean | undefined` | false | When present, it specifies that an input field must be filled out before submitting the form. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact radiobutton documentation](https://primereact.org/radiobutton/) for complete API.*

---

## CPTRating

**PrimeReact Component:** `rating`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number | undefined` | - | Value of the rating. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that the input cannot be typed. |
| `stars` | `number | undefined` | 5 | Number of stars. |
| `cancel` | `boolean | undefined` | true | When specified a cancel icon is displayed to allow removing the value. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `onIcon` | `IconType<RatingProps> | undefined` | - | Icon for the on state. |
| `offIcon` | `IconType<RatingProps> | undefined` | - | Icon for the off state. |
| `cancelIcon` | `IconType<RatingProps> | undefined` | - | Icon for the cancelable state. |
| `cancelIconProps` | `React.HTMLAttributes<HTMLSpanElement>` | - | Properties of the cancel icon. |
| `onIconProps` | `React.HTMLAttributes<HTMLSpanElement>` | - | Properties of the on icon. |
| `offIconProps` | `React.HTMLAttributes<HTMLSpanElement>` | - | Properties of the off icon. |

*... and 3 more props. See [PrimeReact rating documentation](https://primereact.org/rating/) for complete API.*

---

## CPTRow

**PrimeReact Component:** `row`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 5 more props. See [PrimeReact row documentation](https://primereact.org/row/) for complete API.*

---

## CPTSelectButton

**PrimeReact Component:** `selectbutton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `any | undefined` | - | Value of the component. |
| `options` | `SelectItemOptionsType | undefined` | - | An array of objects to display as the available options. |
| `optionLabel` | `string | undefined` | - | Name of the label field of an option when an arbitrary objects instead of SelectItems are used as... |
| `optionValue` | `string | undefined` | - | Name of the value field of an option when arbitrary objects are used as options instead of Select... |
| `optionDisabled` | `string | ((option: any) => boolean)` | - | Property name or getter function to use as the disabled flag of an option, defaults to false when... |
| `tabIndex` | `number | undefined` | - | Index of the element in tabbing order. |
| `multiple` | `boolean | undefined` | false | When specified, allows selecting multiple values. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `unselectable` | `boolean | undefined` | true | Whether selection can be cleared. |
| `allowEmpty` | `boolean | undefined` | true | Whether selection can not be cleared. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `dataKey` | `string | undefined` | - | A property to uniquely match the value in options for better performance. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact selectbutton documentation](https://primereact.org/selectbutton/) for complete API.*

---

## CPTSidebar

**PrimeReact Component:** `sidebar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `maskStyle` | `React.CSSProperties | undefined` | - | Inline style of the mask. |
| `maskClassName` | `string | undefined` | - | Style class of the mask. |
| `visible` | `boolean | undefined` | false | Specifies the visibility of the dialog. |
| `position` | `'top' | 'bottom' | 'left' | 'right' | undefined` | left | Specifies the position of the sidebar, valid values are "left" and "right". |
| `fullScreen` | `boolean | undefined` | false | Adds a close icon to the header to hide the dialog. |
| `blockScroll` | `boolean | undefined` | false | Whether to block scrolling of the document when sidebar is active. |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `dismissable` | `boolean | undefined` | true | Whether to dismiss sidebar on click of the mask. |
| `showCloseIcon` | `boolean | undefined` | true | Whether to display a close icon inside the panel. |
| `closeIcon` | `IconType<SidebarProps> | undefined` | - | Icon of the close button. |
| `ariaCloseLabel` | `string | undefined` | close | Aria label of the close icon. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the sidebar. |
| `header` | `React.ReactNode | ((props: SidebarProps) => React.ReactNode)` | true | Custom template for the header. |
| `icons` | `React.ReactNode | ((props: SidebarProps) => React.ReactNode)` | true | Custom icons template for the header. |
| `modal` | `boolean | undefined` | true | Whether to a modal layer behind the sidebar. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `content` | `React.ReactNode | ((props: ContentProps) => React.ReactNode)` | - | Specifies a custom content for the sidebar. For more complex markup, use the "content" slot instead. |

*... and 3 more props. See [PrimeReact sidebar documentation](https://primereact.org/sidebar/) for complete API.*

---

## CPTSkeleton

**PrimeReact Component:** `skeleton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `shape` | `'rectangle' | 'circle' | undefined` | rectangle | It specifies an alternate text for an image, if the image cannot be displayed. |
| `size` | `string | undefined` | - | Size of the Circle or Square. |
| `width` | `string | undefined` | 100% | Width of the element. |
| `height` | `string | undefined` | 1rem | Height of the element. |
| `borderRadius` | `string | undefined` | - | Border radius of the element, defaults to value from theme. |
| `animation` | `'wave' | 'none' | undefined` | wave | Type of the animation, valid options are "wave" and "none". |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact skeleton documentation](https://primereact.org/skeleton/) for complete API.*

---

## CPTSlideMenu

**PrimeReact Component:** `slidemenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `autoZIndex` | `boolean | undefined` | true | Whether to automatically manage layering. |
| `backIcon` | `IconType<SlideMenuProps> | undefined` | - | Defines the backward icon. |
| `backLabel` | `string | undefined` | Back | Label of element to navigate back. |
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to use in layering. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `easing` | `string | undefined` | ease-out | Easing animation to use for sliding. |
| `effectDuration` | `number | undefined` | 250 | Duration of the sliding animation in milliseconds. |
| `menuWidth` | `number | undefined` | 190 | Width of the submenus. |
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `popup` | `boolean | undefined` | false | Defines if menu would displayed as a popup. |
| `submenuIcon` | `IconType<SlideMenuProps> | undefined` | - | Icon of the submenu. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `viewportHeight` | `number | undefined` | 175 | Height of the scrollable area, a scrollbar appears if a menu height is longer than this value. |
| `closeOnEscape` | `boolean | undefined` | true | Specifies if pressing escape key should hide the SlideMenu Popup. |

*... and 3 more props. See [PrimeReact slidemenu documentation](https://primereact.org/slidemenu/) for complete API.*

---

## CPTSlider

**PrimeReact Component:** `slider`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `number | [number, number] | undefined` | 0 | Value of the component. |
| `min` | `number | undefined` | 0 | Mininum boundary value. |
| `max` | `number | undefined` | 100 | Maximum boundary value. |
| `orientation` | `'horizontal' | 'vertical' | undefined` | horizontal | Orientation of the slider, valid values are horizontal and vertical. |
| `step` | `number | undefined` | 1 | Step factor to increment/decrement the value. |
| `range` | `boolean | undefined` | false | When speficed, allows two boundary values to be picked. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact slider documentation](https://primereact.org/slider/) for complete API.*

---

## CPTSpeedDial

**PrimeReact Component:** `speeddial`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[]` | - | MenuModel instance to define the action items. |
| `visible` | `boolean | undefined` | false | Specifies the visibility of the overlay. |
| `direction` | `'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right'...` | up | Specifies the opening direction of actions. Valid values are 'up', 'down', 'left', 'right', 'up-l... |
| `transitionDelay` | `number | undefined` | 30 | Transition delay step for each action item. |
| `type` | `'linear' | 'circle' | 'semi-circle' | 'quarter-circle' | ...` | linear | Specifies the opening type of actions. |
| `radius` | `number | undefined` | 0 | Radius for *circle types. |
| `mask` | `boolean | undefined` | false | Whether to show a mask element behind the speeddial. |
| `disabled` | `boolean | undefined` | false | Whether the component is disabled. |
| `hideOnClickOutside` | `boolean | undefined` | true | Whether the actions close when clicked outside. |
| `buttonStyle` | `React.CSSProperties` | - | Inline style of the button element. |
| `buttonClassName` | `string | undefined` | - | Style class of the button element. |
| `buttonTemplate` | `React.ReactNode | ((options: SpeedDialButtonOptions) => R...` | - | Template of button element. |
| `maskStyle` | `React.CSSProperties | undefined` | - | Inline style of the mask element. |
| `maskClassName` | `string | undefined` | - | Style class of the mask element. |
| `showIcon` | `IconType<SpeedDialProps> | undefined` | - | Show icon of the button element. |
| `hideIcon` | `IconType<SpeedDialProps> | undefined` | - | Hide icon of the button element. |
| `rotateAnimation` | `boolean | undefined` | true | Defined to rotate showIcon when hideIcon is not present. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact speeddial documentation](https://primereact.org/speeddial/) for complete API.*

---

## CPTSplitButton

**PrimeReact Component:** `splitbutton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string | undefined` | - | Text of the button. |
| `icon` | `IconType<SplitButtonProps> | undefined` | - | Name of the icon. |
| `text` | `boolean | undefined` | false | Add a textual class to the button without a background initially. |
| `rounded` | `boolean | undefined` | false | Add a circular border radius to the button. |
| `raised` | `boolean | undefined` | false | Add a shadow to indicate elevation. |
| `outlined` | `boolean | undefined` | false | Add a border class without a background initially. |
| `severity` | `'secondary' | 'success' | 'info' | 'warning' | 'danger' |...` | - | Defines the style of the button, valid values are "secondary", "success", "info", "warning", "dan... |
| `size` | `'small' | 'large' | undefined` | - | Defines the size of the button, valid values are "small" and "large". |
| `loading` | `boolean | undefined` | false | Display loading icon of the button |
| `loadingIcon` | `IconType<SplitButtonProps> | undefined` | - | Name of the loading icon or JSX.Element for loading icon. |
| `model` | `MenuItem[] | undefined` | - | MenuModel instance to define the overlay items. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `visible` | `boolean | undefined` | true | When present, it specifies that the element should be visible. |
| `buttonClassName` | `string | undefined` | - | ClassName of the button. |
| `menuStyle` | `React.CSSProperties | undefined` | - | Inline style of the overlay menu. |
| `menuClassName` | `string | undefined` | - | ClassName class of the overlay menu. |
| `menuButtonClassName` | `string | undefined` | - | ClassName of the menu dropdown button. |
| `buttonProps` | `any | undefined` | - | Props for the main button, any prop is passed implicity to the button element. |
| `menuButtonProps` | `any | undefined` | - | Props for the dropdown button, any prop is passed implicity to the dropdown button element. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `buttonTemplate` | `TemplateType<SplitButtonProps> | undefined` | - | Template of the default button. |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `dropdownIcon` | `IconType<SplitButtonProps> | undefined` | - | Name of the dropdown icon or JSX.Element for dropdown icon. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact splitbutton documentation](https://primereact.org/splitbutton/) for complete API.*

---

## CPTSplitter

**PrimeReact Component:** `splitter`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `layout` | `'vertical' | 'horizontal' | undefined` | horizontal | Orientation of the panels, valid values are "horizontal" and "vertical". |
| `gutterSize` | `number | undefined` | 4 | Size of the divider in pixels. |
| `stateKey` | `string | undefined` | - | Storage identifier of a stateful Splitter. |
| `stateStorage` | `'session' | 'local' | undefined` | session | Defines where a stateful splitter keeps its state, valid values are "session" for sessionStorage ... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `step` | `number | undefined` | 5 | Step factor to increment/decrement the size of the panels while pressing the arrow keys. |

*... and 3 more props. See [PrimeReact splitter documentation](https://primereact.org/splitter/) for complete API.*

---

## CPTSplitterPanel

**PrimeReact Component:** `splitterpanel`

*Type definitions not found. See [PrimeReact splitterpanel documentation](https://primereact.org/splitterpanel/) for complete API.*

---

## CPTSteps

**PrimeReact Component:** `steps`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `activeIndex` | `number | undefined` | 0 | Index of the active item. |
| `readOnly` | `boolean | undefined` | true | Whether the items are clickable or not. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact steps documentation](https://primereact.org/steps/) for complete API.*

---

## CPTTabPanel

**PrimeReact Component:** `tabpanel`

*Type definitions not found. See [PrimeReact tabpanel documentation](https://primereact.org/tabpanel/) for complete API.*

---

## CPTTabView

**PrimeReact Component:** `tabview`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `closable` | `boolean | undefined` | false | Defines if tab can be removed. |
| `contentStyle` | `React.CSSProperties | undefined` | - | Inline style of the tab content. |
| `contentClassName` | `string | undefined` | - | Style class of the tab content. |
| `header` | `React.ReactNode | undefined` | - | Orientation of tab headers. |
| `headerTemplate` | `React.ReactNode | ((options: TabPanelHeaderTemplateOption...` | - | Header template of the tab to customize more. |
| `headerStyle` | `React.CSSProperties | undefined` | - | Inline style of the tab header. |
| `headerClassName` | `string | undefined` | - | Style class of the tab header. |
| `leftIcon` | `IconType<TabPanel> | undefined` | - | Icons can be placed at left of a header. |
| `rightIcon` | `IconType<TabPanel> | undefined` | - | Icons can be placed at right of a header. |
| `prevButton` | `IconType<TabPanel> | undefined` | - | Previous button of the tab header. |
| `nextButton` | `IconType<TabPanel> | undefined` | - | Next button of the tab header. |
| `closeIcon` | `IconType<TabPanel> | undefined` | - | Close button of the tab header. |
| `disabled` | `boolean | undefined` | false | Whether the tab is disabled. |
| `visible` | `boolean | undefined` | true | When set as false, hides the tab panel. |

*... and 5 more props. See [PrimeReact tabview documentation](https://primereact.org/tabview/) for complete API.*

---

## CPTTag

**PrimeReact Component:** `tag`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `React.ReactNode` | - | Value to display inside the tag. |
| `severity` | `'success' | 'info' | 'warning' | 'danger' | 'secondary' |...` | null | Severity type of the tag. |
| `rounded` | `boolean | undefined` | false | Whether the corners of the tag are rounded. |
| `icon` | `IconType<TagProps> | undefined` | - | Icon of the tag to display next to the value. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact tag documentation](https://primereact.org/tag/) for complete API.*

---

## CPTTerminal

**PrimeReact Component:** `terminal`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `welcomeMessage` | `string | undefined` | - | Initial text to display on terminal. |
| `prompt` | `string | undefined` | - | Prompt text for each command. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact terminal documentation](https://primereact.org/terminal/) for complete API.*

---

## CPTTieredMenu

**PrimeReact Component:** `tieredmenu`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `model` | `MenuItem[] | undefined` | - | An array of menuitems. |
| `popup` | `boolean | undefined` | false | Defines if menu would displayed as a popup. |
| `autoZIndex` | `boolean | undefined` | true | Whether to automatically manage layering. |
| `breakpoint` | `string | undefined` | - | The breakpoint to define the maximum width boundary when responsiveness is enabled. |
| `scrollHeight` | `string | undefined` | 400px | Maximum height of the options panel on responsive mode. |
| `baseZIndex` | `number | undefined` | 0 | Whether to automatically manage layering. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `submenuIcon` | `IconType<TieredMenuProps> | undefined` | - | Icon of the submenu. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact tieredmenu documentation](https://primereact.org/tieredmenu/) for complete API.*

---

## CPTTimeline

**PrimeReact Component:** `timeline`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `align` | `'left' | 'right' | 'top' | 'bottom' | 'alternate' | undef...` | left | Position of the timeline bar relative to the content. Valid values are "left", "right for vertica... |
| `children` | `React.ReactNode` | - | Used to get the child elements of the component. |
| `content` | `React.ReactNode | ((item: any, index: number) => React.Re...` | - | Template of the content. |
| `dataKey` | `string | undefined` | - | Name of the field that uniquely identifies a record in the data. Should be a unique business key ... |
| `layout` | `'vertical' | 'horizontal' | undefined` | vertical | Orientation of the timeline, valid values are "vertical" and "horizontal". |
| `marker` | `React.ReactNode | ((item: any, index: number) => React.Re...` | - | Template content allows placing a custom event marker instead of the default one. |
| `opposite` | `React.ReactNode | ((item: any, index: number) => React.Re...` | - | Template content to be placed at the other side of the bar. |
| `value` | `any[] | undefined` | - | An array of events to display. |

*... and 3 more props. See [PrimeReact timeline documentation](https://primereact.org/timeline/) for complete API.*

---

## CPTToast

**PrimeReact Component:** `toast`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `baseZIndex` | `number | undefined` | 0 | Base zIndex value to add to initial layering of PrimeReact components which start from 1000. |
| `position` | `'center' | 'top-center' | 'top-left' | 'top-right' | 'bot...` | top-right | Position of the toast in viewport, valid values are 'center', 'top-center', 'top-left', 'top-righ... |
| `transitionOptions` | `CSSTransitionProps | undefined` | - | The properties of CSSTransition can be customized, except for "nodeRef" and "in" properties. |
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | self | DOM element instance where the component should be mounted. Valid values are any DOM Element and ... |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `content` | `React.ReactNode | ((props: ContentProps) => React.ReactNode)` | - | Specifies a custom content for the toast. For more complex markup, use the "content" slot instead. |

*... and 2 more props. See [PrimeReact toast documentation](https://primereact.org/toast/) for complete API.*

---

## CPTToggleButton

**PrimeReact Component:** `togglebutton`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `checked` | `boolean | undefined` | false | Specifies the on/off state of the button. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `iconPos` | `'left' | 'right' | undefined` | left | Position of the icon, valid values are "left" and "right". |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element should be disabled. |
| `readonly` | `boolean | undefined` | - | When present, it specifies that an input field is read-only. |
| `offIcon` | `IconType<ToggleButtonProps> | undefined` | - | Icon for the off state. |
| `offLabel` | `string | undefined` | no | Label for the off state. |
| `onIcon` | `IconType<ToggleButtonProps> | undefined` | - | Icon for the on state. |
| `onLabel` | `string | undefined` | yes | Label for the on state. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |

*... and 3 more props. See [PrimeReact togglebutton documentation](https://primereact.org/togglebutton/) for complete API.*

---

## CPTToolbar

**PrimeReact Component:** `toolbar`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `left` | `React.ReactNode | ((props: ToolbarProps) => React.ReactNode)` | - | The template of left section. |
| `right` | `React.ReactNode | ((props: ToolbarProps) => React.ReactNode)` | - | The template of right section. |
| `start` | `React.ReactNode | ((props: ToolbarProps) => React.ReactNode)` | - | The template of start section. |
| `center` | `React.ReactNode | ((props: ToolbarProps) => React.ReactNode)` | - | The template of center section. |
| `end` | `React.ReactNode | ((props: ToolbarProps) => React.ReactNode)` | - | The template of end section. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact toolbar documentation](https://primereact.org/toolbar/) for complete API.*

---

## CPTTooltip

**PrimeReact Component:** `tooltip`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `target` | `string | string[] | HTMLElement | React.RefObject<HTMLEle...` | - | Target element on global tooltip option. |
| `content` | `React.ReactNode | string | undefined` | - | Content to be displayed in tooltip. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact tooltip documentation](https://primereact.org/tooltip/) for complete API.*

---

## CPTTreeSelect

**PrimeReact Component:** `treeselect`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `appendTo` | `'self' | HTMLElement | undefined | null | (() => HTMLElem...` | document.body | DOM element instance where the overlay panel should be mounted. Valid values are any DOM Element ... |
| `ariaLabel` | `string | undefined` | - | Used to define a string that labels the component. |
| `ariaLabelledBy` | `string | undefined` | - | Establishes relationships between the component and label(s) where its value should be one or mor... |
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `clearIcon` | `IconType<TreeSelectProps> | undefined` | - | Icon of the dropdown. |
| `closeIcon` | `IconType<TreeSelectProps> | undefined` | - | Icon of the close button. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the component should be disabled. |
| `display` | `'comma' | 'chip' | undefined` | comma | Defines how the selected items are displayed, valid values are "comma" and "chip". |
| `dropdownIcon` | `IconType<TreeSelectProps> | undefined` | - | Icon of the dropdown. |
| `emptyMessage` | `React.ReactNode | ((props: TreeSelectProps) => React.Reac...` | No available options | Text to display when there is no data. |
| `expandedKeys` | `TreeSelectExpandedKeysType | undefined` | - | An array of keys to represent the state of the treeselect expansion state in controlled mode. |
| `filter` | `boolean | undefined` | false | When specified, displays an input field to filter the items. |
| `filterBy` | `string | undefined` | label | When filtering is enabled, filterBy decides which field or fields (comma separated) to search aga... |
| `filterDelay` | `number | undefined` | 300 | Delay in milliseconds before filtering the data. |
| `filterIcon` | `IconType<TreeSelectProps> | undefined` | - | Icon of the filter. |
| `filterInputAutoFocus` | `boolean | undefined` | true | When the panel is opened, it specifies that the filter input should focus automatically. |
| `filterLocale` | `string | undefined` | undefined | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterMode` | `'lenient' | 'strict' | undefined` | lenient | Mode for filtering valid values are "lenient" and "strict". Default is lenient. |
| `filterPlaceholder` | `string | undefined` | - | Placeholder text to show when filter input is empty. |
| `filterTemplate` | `React.ReactNode | ((options: TreeSelectFilterTemplateOpti...` | - | Custom template for the filter element. |
| `filterValue` | `string | undefined` | - | When filtering is enabled, the value of input field. To control the value externally, use with on... |
| `inputId` | `string | undefined` | - | Identifier of the input element. |
| `inputRef` | `React.Ref<HTMLInputElement> | undefined` | - | Reference of the input element. |
| `metaKeySelection` | `boolean | undefined` | true | Defines how multiple items can be selected, when true metaKey needs to be pressed to select or un... |
| `name` | `string | undefined` | - | Name of the input element. |
| `nodeTemplate` | `React.ReactNode | ((node: TreeNode, options: TreeNodeTemp...` | false | Template of internally used tree component node element. |
| `options` | `TreeNode[] | undefined` | - | An array of options to display. |
| `panelClassName` | `string | undefined` | - | Style class of the overlay panel element. |
| `panelFooterTemplate` | `React.ReactNode | ((props: TreeSelectProps) => React.Reac...` | - | The template of footer. |

*... and 18 more props. See [PrimeReact treeselect documentation](https://primereact.org/treeselect/) for complete API.*

---

## CPTTreeTable

**PrimeReact Component:** `treetable`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `alwaysShowPaginator` | `boolean | undefined` | true | Whether to show it even there is only one page. |
| `checkboxIcon` | `IconType<TreeTableProps> | undefined` | - | Icon of the checkbox when checked. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |
| `columnResizeMode` | `'fit' | 'expand' | undefined` | fit | Defines whether the overall table width should change on column resize, valid values are "fit" an... |
| `contextMenuSelectionKey` | `string | undefined` | - | A single key to control the selection with the context menu. |
| `currentPageReportTemplate` | `string | undefined` | (&#123;currentPage&#125; of &#123;totalPages&#125;) | Template of the current page report element. Available placeholders are &#123;currentPage&#125;, ... |
| `defaultSortOrder` | `1 | 0 | -1 | undefined | null` | 1 | Default sort order of an unsorted column. |
| `emptyMessage` | `string | React.ReactNode | ((props: TreeTableProps) => Re...` | No results found | Text to display when there is no data. |
| `expandedKeys` | `TreeTableExpandedKeysType | undefined` | - | An array of keys to represent the state of the tree expansion state in controlled mode. |
| `filterDelay` | `number | undefined` | 300 | Delay in milliseconds before filtering the data. |
| `filterLocale` | `string | undefined` | undefined | Locale to use in filtering. The default locale is the host environment's current locale. |
| `filterMode` | `'lenient' | 'strict' | undefined` | lenient | Mode for filtering valid values are lenient and strict. Default is lenient. |
| `filters` | `TreeTableFilterMeta` | - | An array of FilterMetadata objects to provide external filters. |
| `first` | `number | undefined` | 0 | Index of the first row to be displayed. |
| `footer` | `React.ReactNode | undefined` | - | Footer content of the table. |
| `footerColumnGroup` | `React.ReactElement | undefined` | - | ColumnCroup component for footer. |
| `frozenFooterColumnGroup` | `React.ReactElement | undefined` | - | ColumnCroup component for footer of frozen columns. |
| `frozenHeaderColumnGroup` | `React.ReactElement | undefined` | - | ColumnCroup component for header of frozen columns. |
| `frozenWidth` | `string | undefined` | - | Width of the frozen part in scrollable DataTable. |
| `globalFilter` | `string | undefined | null` | - | Value of the global filter to use in filtering. |
| `globalFilterMatchMode` | `'startsWith' | 'contains' | 'notContains' | 'endsWith' | ...` | contains | Defines filterMatchMode; "startsWith", "contains", "endsWith", "equals", "notEquals", "in", "notI... |
| `header` | `React.ReactNode | undefined` | - | Header content of the table. |
| `headerColumnGroup` | `React.ReactElement | undefined` | - | ColumnCroup component for header. |
| `lazy` | `boolean | undefined` | false | Defines if data is loaded and interacted with in lazy manner. |
| `loading` | `boolean | undefined` | false | Displays a loader to indicate data load is in progress. |
| `loadingIcon` | `IconType<TreeTableProps> | undefined` | - | The icon to show while indicating data load is in progress. |
| `metaKeySelection` | `boolean | undefined` | true | Defines whether metaKey is requred or not for the selection. When true metaKey needs to be presse... |
| `multiSortMeta` | `TreeTableSortMeta[] | undefined | null` | - | An array of SortMeta objects to sort the data by default in multiple sort mode. |
| `pageLinkSize` | `number | undefined` | 5 | Number of page links to display. |
| `paginator` | `boolean | undefined` | false | When specified as true, enables the pagination. |

*... and 41 more props. See [PrimeReact treetable documentation](https://primereact.org/treetable/) for complete API.*

---

## CPTTriStateCheckbox

**PrimeReact Component:** `tristatecheckbox`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `autoFocus` | `boolean | undefined` | false | When present, it specifies that the component should automatically get focus on load. |
| `value` | `boolean | undefined | null` | - | Value of the TriStateCheckbox. |
| `invalid` | `boolean | undefined` | false | When present, it specifies that the component should have invalid state style. |
| `disabled` | `boolean | undefined` | false | When present, it specifies that the element value cannot be altered. |
| `variant` | `'outlined' | 'filled' | undefined` | outlined | Specifies the input variant of the component. |
| `readOnly` | `boolean | undefined` | false | When present, it specifies that the value cannot be changed. |
| `checkIcon` | `IconType<TriStateCheckboxProps> | undefined` | - | Icon of the checkbox when checked. |
| `uncheckIcon` | `IconType<TriStateCheckboxProps> | undefined` | - | Icon of the checkbox when unchecked. |
| `tooltip` | `string | undefined` | - | Content of the tooltip. |
| `tooltipOptions` | `TooltipOptions | undefined` | - | Configuration of the tooltip, refer to the tooltip documentation for more information. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 3 more props. See [PrimeReact tristatecheckbox documentation](https://primereact.org/tristatecheckbox/) for complete API.*

---

## CPTVirtualScroller

**PrimeReact Component:** `virtualscroller`

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tabIndex` | `number | undefined` | 0 | Index of the element in tabbing order. |
| `items` | `any[] | any[][] | undefined | null` | - | An array of objects to display. |
| `itemSize` | `number | number[] | undefined` | - | The height/width of item according to orientation. |
| `scrollHeight` | `string | undefined` | - | Height of the scroll viewport. |
| `scrollWidth` | `string | undefined` | - | Width of the scroll viewport. |
| `orientation` | `'vertical' | 'horizontal' | 'both' | undefined` | 'vertical' | The orientation of scrollbar, valid values are 'vertical', 'horizontal' and 'both'. |
| `step` | `number | undefined` | 0 | Used to specify how many items to load in each load method in lazy mode. |
| `numToleratedItems` | `number | undefined` | - | Determines how many additional elements to add to the DOM outside of the view. According to the s... |
| `delay` | `number | undefined` | 0 | Delay in scroll before new data is loaded. |
| `resizeDelay` | `number | undefined` | 10 | Delay after window's resize finishes. |
| `appendOnly` | `boolean | undefined` | false | Used to append each loaded item to top without removing any items from the DOM. Using very large ... |
| `inline` | `boolean | undefined` | false | When enabled, positions the content as inline. |
| `lazy` | `boolean | undefined` | false | Defines if data is loaded and interacted with in lazy manner. |
| `disabled` | `boolean | undefined` | false | If disabled, the VirtualScroller feature is eliminated and the content is displayed directly. |
| `loaderDisabled` | `boolean | undefined` | false | Used to implement a custom loader instead of using the loader feature in the VirtualScroller. |
| `columns` | `any | undefined` | - | Columns of the virtual scroller for vertical option. |
| `loading` | `boolean | undefined` | false | Whether the data is loaded. |
| `autoSize` | `boolean | undefined` | false | Whether to dynamically change the height or width of scrollable container. |
| `showSpacer` | `boolean | undefined` | true | Used to implement a custom spacer instead of using the spacer feature in the VirtualScroller. |
| `showLoader` | `boolean | undefined` | false | Whether to show loader. |
| `loadingIcon` | `IconType<VirtualScrollerProps> | undefined` | - | The icon to show while indicating data load is in progress. |
| `loadingTemplate` | `React.ReactNode | ((options: VirtualScrollerLoadingTempla...` | - | The template of loader. |
| `loaderIconTemplate` | `React.ReactNode | ((options: VirtualScrollerLoaderIconTem...` | - | The template of loader's icon. |
| `itemTemplate` | `React.ReactNode | ((item: any, options: VirtualScrollerTe...` | - | The template of item. |
| `contentTemplate` | `React.ReactNode | ((options: VirtualScrollerContentTempla...` | - | The template of item's wrapper element. |
| `children` | `React.ReactNode | undefined` | - | Used to get the child elements of the component. |

*... and 5 more props. See [PrimeReact virtualscroller documentation](https://primereact.org/virtualscroller/) for complete API.*

---

