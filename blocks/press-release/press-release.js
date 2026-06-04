import { getMetadata } from '../../scripts/aem.js';
import { isAuthorEnvironment } from '../../scripts/scripts.js';
import { getHostname, mapAemPathToSitePath } from '../../scripts/utils.js';

/**
 *
 * @param {Element} block
 */
export default async function decorate(block) {
  const CONFIG = {
    WRAPPER_SERVICE_URL: 'https://3635370-refdemoapigateway-stage.adobeioruntime.net/api/v1/web/ref-demo-api-gateway/fetch-cf',
    GRAPHQL_QUERY: '/graphql/execute.json/wehealthcare/pressreleasev2',
    EXCLUDED_THEME_KEYS: new Set(['brandSite', 'brandLogo']),
  };

  const hostnameFromPlaceholders = await getHostname();
  const hostname = hostnameFromPlaceholders ? hostnameFromPlaceholders : getMetadata('hostname');
  const aemauthorurl = getMetadata('authorurl') || '';

  const aempublishurl = hostname?.replace('author', 'publish')?.replace(/\/$/, '');

  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
  const variationname = block.querySelector(':scope div:nth-child(2) > div')?.textContent?.trim()?.toLowerCase()?.replace(' ', '_') || 'master';
  const alignment = block.querySelector(':scope div:nth-child(3) > div')?.textContent?.trim() || '';

  block.innerHTML = '';
  const isAuthor = isAuthorEnvironment();

  const requestConfig = isAuthor
    ? {
      url: `${aemauthorurl}${CONFIG.GRAPHQL_QUERY};path=${contentPath};variation=${variationname};ts=${Date.now()}`,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }
    : {
      url: `${CONFIG.WRAPPER_SERVICE_URL}`,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        graphQLPath: `${aempublishurl}${CONFIG.GRAPHQL_QUERY}`,
        cfPath: contentPath,
        variation: `${variationname};ts=${Date.now()}`,
      }),
    };

  try {
    const response = await fetch(requestConfig.url, {
      method: requestConfig.method,
      headers: requestConfig.headers,
      ...(requestConfig.body && { body: requestConfig.body }),
    });

    if (!response.ok) {
      console.error(`error making cf graphql request:${response.status}`, {
        contentPath,
        variationname,
        isAuthor,
      });
      block.innerHTML = '';
      return;
    }

    let offer;
    try {
      offer = await response.json();
    } catch (parseError) {
      console.error('Error parsing offer JSON from response:', {
        error: parseError.message,
        stack: parseError.stack,
        contentPath,
        variationname,
        isAuthor,
      });
      block.innerHTML = '';
      return;
    }

    const cfReq = offer?.data?.pressReleaseV2ByPath?.item;

    if (!cfReq) {
      console.error('Error parsing response from GraphQL request - no valid data found', {
        response: offer,
        contentPath,
        variationname,
      });
      block.innerHTML = '';
      return;
    }

    const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/${variationname}`;
    block.setAttribute('data-aue-type', 'container');
    
    let bannerDetailStyle = '';

    block.innerHTML = `<div class='banner-content block' data-aue-resource=${itemId} data-aue-label=${variationname || 'Elements'} data-aue-type="reference" data-aue-filter="contentfragment">
          <div class='banner-detail ${alignment}' style="${bannerDetailStyle}" data-aue-prop="bannerimage" data-aue-label="Main Image" data-aue-type="media" >
                <h2 data-aue-prop="title" data-aue-label="Title" data-aue-type="text" class='cftitle'>${cfReq?.headline}</h2>
                <h3 data-aue-prop="subtitle" data-aue-label="SubTitle" data-aue-type="text" class='cfsubtitle'><strong>${cfReq?.subheadline}</strong></h3>
                <h3 data-aue-prop="subtitle" data-aue-label="SubTitle" data-aue-type="text" class='cfsubtitle'>${cfReq?.date}</h3>
                <div data-aue-prop="description" data-aue-label="Description" data-aue-type="richtext" class='cfdescription'><p>${cfReq?.body?.plaintext || ''}</p></div>
                <a href="${cfReq?.ctaLink}" data-aue-prop="ctaLink" data-aue-label="Button Link/URL" data-aue-type="reference"  target="_blank" rel="noopener" data-aue-filter="page" class='button'>
                    <span data-aue-prop="ctaText" data-aue-label="Button Label" data-aue-type="text">
                      ${cfReq?.ctaText}
                    </span>
                  </a>
            </div>
        </div>`;
  } catch (error) {
    console.error('Error rendering press release:', {
      error: error.message,
      stack: error.stack,
      contentPath,
      variationname,
      isAuthor,
    });
    block.innerHTML = '';
  }
}
