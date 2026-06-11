# coskyai.com Domain Setup

GitHub Pages is configured with the custom domain:

```text
coskyai.com
```

## Alibaba Cloud DNS Records

In Alibaba Cloud DNS, add these records for the root domain.

| Type | Host Record | Value | TTL |
| --- | --- | --- | --- |
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |

Also add `www` as a convenience redirect target.

| Type | Host Record | Value | TTL |
| --- | --- | --- | --- |
| CNAME | www | luojiangyong.github.io | 600 |

Optional IPv6 records:

| Type | Host Record | Value | TTL |
| --- | --- | --- | --- |
| AAAA | @ | 2606:50c0:8000::153 | 600 |
| AAAA | @ | 2606:50c0:8001::153 | 600 |
| AAAA | @ | 2606:50c0:8002::153 | 600 |
| AAAA | @ | 2606:50c0:8003::153 | 600 |

## HTTPS

After DNS resolves to GitHub Pages, GitHub will issue a certificate. Then enable HTTPS enforcement in Pages settings or run:

```powershell
gh api -X PUT repos/LuoJiangYong/real-estate-ai-lab/pages -F https_enforced=true
```

Certificate provisioning can take time after DNS changes.

