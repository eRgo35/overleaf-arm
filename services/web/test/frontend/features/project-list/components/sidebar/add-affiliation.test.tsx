import { screen, waitFor } from '@testing-library/react'
import { expect } from 'chai'
import fetchMock from 'fetch-mock'
import { renderWithProjectListContext } from '../../helpers/render-with-context'
import AddAffiliation from '../../../../../../frontend/js/features/project-list/components/add-affiliation'
import { Affiliation } from '../../../../../../types/affiliation'
import getMeta from '@/utils/meta'

describe('Add affiliation widget', function () {
  const validateNonExistence = () => {
    expect(screen.queryByText(/are you affiliated with an institution/i)).to.be
      .null
    expect(screen.queryByRole('link', { name: /add affiliation/i })).to.be.null
  }

  beforeEach(function () {
    fetchMock.reset()
  })

  afterEach(function () {
    fetchMock.reset()
  })

  it('renders the component', async function () {
    Object.assign(getMeta('ol-ExposedSettings'), { isOverleaf: true })
    window.metaAttributesCache.set('ol-userAffiliations', [])

    renderWithProjectListContext(<AddAffiliation />)

    await fetchMock.flush(true)
    await waitFor(() => expect(fetchMock.called('/api/project')))

    screen.getByText(/are you affiliated with an institution/i)
    const addAffiliationLink = screen.getByRole('button', {
      name: /add affiliation/i,
    })
    expect(addAffiliationLink.getAttribute('href')).to.equal('/user/settings')
  })

  it('does not render when `isOverleaf` is `false`', async function () {
    Object.assign(getMeta('ol-ExposedSettings'), { isOverleaf: false })
    window.metaAttributesCache.set('ol-userAffiliations', [])

    renderWithProjectListContext(<AddAffiliation />)

    await fetchMock.flush(true)
    await waitFor(() => expect(fetchMock.called('/api/project')))

    validateNonExistence()
  })

  it('does not render when there no projects', async function () {
    Object.assign(getMeta('ol-ExposedSettings'), { isOverleaf: true })
    window.metaAttributesCache.set('ol-userAffiliations', [])

    renderWithProjectListContext(<AddAffiliation />, {
      projects: [],
    })

    await fetchMock.flush(true)
    await waitFor(() => expect(fetchMock.called('/api/project')))

    validateNonExistence()
  })

  it('does not render when there are affiliations', async function () {
    Object.assign(getMeta('ol-ExposedSettings'), { isOverleaf: true })
    window.metaAttributesCache.set('ol-userAffiliations', [{} as Affiliation])

    renderWithProjectListContext(<AddAffiliation />)

    await fetchMock.flush(true)
    await waitFor(() => expect(fetchMock.called('/api/project')))

    validateNonExistence()
  })
})
