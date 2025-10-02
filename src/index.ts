import {
	CorePalette,
	DynamicScheme,
	Hct,
	MaterialDynamicColors,
	SchemeContent,
	SchemeExpressive,
	SchemeFidelity,
	SchemeMonochrome,
	SchemeNeutral,
	SchemeTonalSpot,
	SchemeVibrant,
	argbFromHex,
	hexFromArgb,
} from '@material/material-color-utilities'

export type Scheme =
	| 'tonal'
	| 'vibrant'
	| 'expressive'
	| 'content'
	| 'neutral'
	| 'monochrome'
	| 'fidelity'
	| 'dynamic'

const materialColors = {
	['background']: MaterialDynamicColors.background,
	['error']: MaterialDynamicColors.error,
	['error-container']: MaterialDynamicColors.errorContainer,
	['inverse-on-surface']: MaterialDynamicColors.inverseOnSurface,
	['inverse-primary']: MaterialDynamicColors.inversePrimary,
	['inverse-surface']: MaterialDynamicColors.inverseSurface,
	['on-background']: MaterialDynamicColors.onBackground,
	['on-error']: MaterialDynamicColors.onError,
	['on-error-container']: MaterialDynamicColors.onErrorContainer,
	['on-primary']: MaterialDynamicColors.onPrimary,
	['on-primary-container']: MaterialDynamicColors.onPrimaryContainer,
	['on-primary-fixed']: MaterialDynamicColors.onPrimaryFixed,
	['on-primary-fixed-variant']: MaterialDynamicColors.onPrimaryFixedVariant,
	['on-secondary']: MaterialDynamicColors.onSecondary,
	['on-secondary-container']: MaterialDynamicColors.onSecondaryContainer,
	['on-secondary-fixed']: MaterialDynamicColors.onSecondaryFixed,
	['on-secondary-fixed-variant']: MaterialDynamicColors.onSecondaryFixedVariant,
	['on-surface']: MaterialDynamicColors.onSurface,
	['on-surface-variant']: MaterialDynamicColors.onSurfaceVariant,
	['on-tertiary']: MaterialDynamicColors.onTertiary,
	['on-tertiary-container']: MaterialDynamicColors.onTertiaryContainer,
	['on-tertiary-fixed']: MaterialDynamicColors.onTertiaryFixed,
	['on-tertiary-fixed-variant']: MaterialDynamicColors.onTertiaryFixedVariant,
	['outline']: MaterialDynamicColors.outline,
	['outline-variant']: MaterialDynamicColors.outlineVariant,
	['primary']: MaterialDynamicColors.primary,
	['primary-container']: MaterialDynamicColors.primaryContainer,
	['primary-fixed']: MaterialDynamicColors.primaryFixed,
	['primary-fixed-dim']: MaterialDynamicColors.primaryFixedDim,
	['scrim']: MaterialDynamicColors.scrim,
	['secondary']: MaterialDynamicColors.secondary,
	['secondary-container']: MaterialDynamicColors.secondaryContainer,
	['secondary-fixed']: MaterialDynamicColors.secondaryFixed,
	['secondary-fixed-dim']: MaterialDynamicColors.secondaryFixedDim,
	['shadow']: MaterialDynamicColors.shadow,
	['surface']: MaterialDynamicColors.surface,
	['surface-bright']: MaterialDynamicColors.surfaceBright,
	['surface-container']: MaterialDynamicColors.surfaceContainer,
	['surface-container-high']: MaterialDynamicColors.surfaceContainerHigh,
	['surface-container-highest']: MaterialDynamicColors.surfaceContainerHighest,
	['surface-container-low']: MaterialDynamicColors.surfaceContainerLow,
	['surface-container-lowest']: MaterialDynamicColors.surfaceContainerLowest,
	['surface-dim']: MaterialDynamicColors.surfaceDim,
	['surface-tint']: MaterialDynamicColors.surfaceTint,
	['surface-variant']: MaterialDynamicColors.surfaceVariant,
	['tertiary']: MaterialDynamicColors.tertiary,
	['tertiary-container']: MaterialDynamicColors.tertiaryContainer,
	['tertiary-fixed']: MaterialDynamicColors.tertiaryFixed,
	['tertiary-fixed-dim']: MaterialDynamicColors.tertiaryFixedDim,
}

/**
 * Convert a hex value to a HCT tuple
 */
export function hctFromHex(hex: string) {
	return Hct.fromInt(argbFromHex(hex))
}

/**
 * Convert a HCT tuple to a hex value
 */
export function hexFromHct(hue: number, chroma: number, tone: number): string {
	return hexFromArgb(Hct.from(hue, chroma, tone).toInt())
}

export function themeFromSourceColor(
	color:
		| string
		| {primary: string; secondary: string; tertiary: string; neutral: string},
	isDark: boolean,
	scheme: Scheme,
	contrast: number,
) {
	if (
		(typeof color !== 'string' && scheme !== 'dynamic') ||
		(typeof color !== 'object' && scheme === 'dynamic')
	) {
		throw new Error('color / scheme type mismatch')
		return
	}
	/* import and use other schemas from m-c-u for the scheme you want, but this is the "default"
     https://github.com/material-foundation/material-color-utilities/tree/main/typescript/scheme
   */
	let colorScheme: DynamicScheme
	if (scheme === 'tonal') {
		colorScheme = new SchemeTonalSpot(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'fidelity') {
		colorScheme = new SchemeFidelity(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'vibrant') {
		colorScheme = new SchemeVibrant(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'expressive') {
		colorScheme = new SchemeExpressive(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'content') {
		colorScheme = new SchemeContent(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'neutral') {
		colorScheme = new SchemeNeutral(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'monochrome') {
		colorScheme = new SchemeMonochrome(
			Hct.fromInt(argbFromHex(color as string)),
			isDark,
			contrast,
		)
	} else if (scheme === 'dynamic' && typeof color === 'object') {
		const primary = argbFromHex(color.primary)
		const palette = CorePalette.of(primary)

		if (color.secondary !== '#000000') {
			const secondary = argbFromHex(color.secondary)
			const secondaryPalette = CorePalette.of(secondary)
			palette.a2 = secondaryPalette.a1
		}

		if (color.tertiary !== '#000000') {
			const tertiary = argbFromHex(color.tertiary)
			const tertiaryPalette = CorePalette.of(tertiary)
			palette.a3 = tertiaryPalette.a1
		}

		if (color.neutral !== '#000000') {
			const neutral = argbFromHex(color.neutral)
			const neutralPalette = CorePalette.of(neutral)
			palette.n1 = neutralPalette.n1
		}

		colorScheme = new DynamicScheme({
			sourceColorArgb: argbFromHex(color.primary),
			variant: 5, // Variant.FIDELITY https://github.com/material-foundation/material-color-utilities/blob/main/typescript/scheme/variant.ts
			contrastLevel: contrast,
			isDark,
			primaryPalette: palette.a1,
			secondaryPalette: palette.a2,
			tertiaryPalette: palette.a3,
			neutralPalette: palette.n1,
			neutralVariantPalette: palette.n2,
		})
	}

	return themeFromScheme(colorScheme!)
}

export function themeFromScheme(colorScheme: DynamicScheme) {
	const theme: {[key: string]: string} = {}

	for (const [key, value] of Object.entries(materialColors)) {
		theme[key] = hexFromArgb(value.getArgb(colorScheme))
	}

	return theme
}
