import TOCInline from 'pliny/ui/TOCInline'
import Pre from 'pliny/ui/Pre'
import BlogNewsletterForm from 'pliny/ui/BlogNewsletterForm'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

// PitfallFree guide components
import TLDRBox from './guide/TLDRBox'
import RedFlags from './guide/RedFlags'
import KeySpecsTable from './guide/KeySpecsTable'
import InteractiveChecklist from './guide/InteractiveChecklist'
import AmazonSearchButton from './guide/AmazonSearchButton'
import AdPlaceholder from './guide/AdPlaceholder'
import LeadMagnetCard from './guide/LeadMagnetCard'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: Pre,
  table: TableWrapper,
  BlogNewsletterForm,
  // PitfallFree guide modules
  TLDRBox,
  RedFlags,
  KeySpecsTable,
  InteractiveChecklist,
  AmazonSearchButton,
  AdPlaceholder,
  LeadMagnetCard,
}
